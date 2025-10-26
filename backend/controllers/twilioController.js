const twilio = require("twilio");
const Ticket = require("../models/Ticket");
const Client = require("../models/Client");

// Twilio credentials (configure no .env)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
let client = null;

if (accountSid && authToken && accountSid.startsWith("AC")) {
  client = twilio(accountSid, authToken);
}

// Webhook para receber mensagens do WhatsApp via Twilio
const receiveWhatsAppMessage = async (req, res) => {
  console.log("Recebendo mensagem WhatsApp:", req.body);
  console.log("Headers:", req.headers);

  try {
    // O Twilio pode enviar dados de diferentes formas
    const from = req.body.From || req.body.from || req.body.sender;
    const body =
      req.body.Body || req.body.body || req.body.message || req.body.text;
    const to = req.body.To || req.body.to;
    const profileName =
      req.body.ProfileName ||
      (typeof req.body.ChannelMetadata === "string"
        ? safeParse(req.body.ChannelMetadata)?.data?.context?.ProfileName
        : undefined);

    console.log("Campos extraídos:", { from, body, to });

    if (!from || !body) {
      console.log("Dados incompletos:", { from, body, to });
      return res.status(400).send("Dados incompletos");
    }

    // Remover o 'whatsapp:' do número se presente
    const clientNumber = from.replace("whatsapp:", "");
    const message = body.trim();

    console.log("Processando mensagem:", { clientNumber, message });

    if (!message) {
      return res.status(200).send("OK"); // Ignorar mensagens vazias
    }

    // Vincular/registrar cliente
    let client = await Client.findOne({ whatsapp: clientNumber });
    if (!client) {
      client = new Client({
        name: profileName || clientNumber,
        whatsapp: clientNumber,
        contacts: [{ type: "whatsapp", value: clientNumber }],
        phones: [clientNumber],
      });
      await client.save();
      console.log("Cliente criado:", client._id);
    } else {
      let shouldSave = false;
      if (profileName && !client.name) {
        client.name = profileName;
        shouldSave = true;
      }
      if (client.phones?.includes(clientNumber) === false) {
        client.phones.push(clientNumber);
        shouldSave = true;
      } else if (!client.phones || client.phones.length === 0) {
        client.phones = [clientNumber];
        shouldSave = true;
      }
      const hasContact = client.contacts?.some(
        (contact) =>
          contact.type === "whatsapp" && contact.value === clientNumber
      );
      if (!hasContact) {
        client.contacts = client.contacts || [];
        client.contacts.push({ type: "whatsapp", value: clientNumber });
        shouldSave = true;
      }
      if (!client.whatsapp) {
        client.whatsapp = clientNumber;
        shouldSave = true;
      }
      if (shouldSave) {
        await client.save();
      }
    }

    const displayName = client.name || profileName || clientNumber;

    // Procurar ticket existente pelo cliente
    console.log("Procurando ticket existente...");
    let ticket = await Ticket.findOne({
      client: client._id,
      channel: "whatsapp",
      status: { $ne: "resolvido" },
    });
    if (!ticket) {
      ticket = await Ticket.findOne({
        clientName: clientNumber,
        channel: "whatsapp",
        status: { $ne: "resolvido" },
      });
      if (ticket) {
        ticket.client = client._id;
        ticket.clientName = displayName;
      }
    }
    console.log("Ticket encontrado:", ticket ? ticket._id : "Nenhum");

    if (!ticket) {
      // Criar novo ticket
      console.log("Criando novo ticket...");
      ticket = new Ticket({
        client: client._id,
        clientName: displayName,
        subject: `Mensagem WhatsApp de ${displayName}`,
        channel: "whatsapp",
        lastUpdate: new Date().toISOString(),
        messages: [{ message, fromClient: true }],
      });
      console.log("Ticket criado:", ticket);
    } else {
      // Adicionar mensagem ao ticket existente
      console.log("Atualizando ticket existente...");
      ticket.messages.push({ message, fromClient: true });
      ticket.lastUpdate = new Date().toISOString();
      ticket.clientName = displayName;
      console.log("Ticket atualizado:", ticket);
    }

    console.log("Salvando ticket...");
    try {
      const savedTicket = await ticket.save();
      console.log("Ticket salvo com sucesso:", savedTicket._id);
    } catch (saveError) {
      console.error("Erro ao salvar ticket:", saveError);
      throw saveError;
    }

    // Responder automaticamente (opcional) - resposta simples primeiro
    const responseMessage =
      "Obrigado pela mensagem! Um atendente entrará em contato em breve.";

    // Para WhatsApp, podemos retornar apenas uma resposta de sucesso
    // O Twilio vai enviar a mensagem automaticamente se configurado
    res.status(200).send("OK");

    // Se quiser enviar resposta automática, descomente o código abaixo:
    /*
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(responseMessage);
    res.set("Content-Type", "text/xml");
    res.send(twiml.toString());
    */
  } catch (error) {
    console.error("Erro ao processar mensagem WhatsApp:", error);
    res.status(500).send("Erro interno");
  }
};

// Função para enviar mensagem via WhatsApp (para resposta do atendente)
const sendWhatsAppMessage = async (req, res) => {
  if (!client) {
    return res.status(500).json({ error: "Twilio não configurado" });
  }

  try {
    const { to, message } = req.body;

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // Número do Twilio
      to: `whatsapp:${to}`,
    });

    res.json({ success: true, messageId: response.sid });
  } catch (error) {
    console.error("Erro ao enviar mensagem WhatsApp:", error);
    res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
};

module.exports = {
  receiveWhatsAppMessage,
  sendWhatsAppMessage,
};

function safeParse(payload) {
  try {
    return JSON.parse(payload);
  } catch (_) {
    return undefined;
  }
}
