const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const Client = require("../models/Client");
const twilioController = require("../controllers/twilioController");

// Webhook para receber mensagens do WhatsApp via Twilio
router.post("/whatsapp", twilioController.receiveWhatsAppMessage);

// Endpoint para enviar mensagens via WhatsApp (para atendentes)
router.post("/whatsapp/send", twilioController.sendWhatsAppMessage);

// Webhook para incoming emails (placeholder)
router.post("/email", async (req, res) => {
  try {
    const { from, subject, text } = req.body;

    let client = null;
    if (from) {
      const normalizedEmail = from.toLowerCase();
      client = await Client.findOne({ email: normalizedEmail });
      if (!client) {
        client = new Client({
          name: normalizedEmail.split("@")[0],
          email: normalizedEmail,
          contacts: [{ type: "email", value: normalizedEmail }],
        });
        await client.save();
      } else {
        let shouldSave = false;
        if (!client.name) {
          client.name = normalizedEmail.split("@")[0];
          shouldSave = true;
        }
        const hasEmailContact = client.contacts?.some(
          (contact) =>
            contact.type === "email" && contact.value === normalizedEmail
        );
        if (!hasEmailContact) {
          client.contacts = client.contacts || [];
          client.contacts.push({ type: "email", value: normalizedEmail });
          shouldSave = true;
        }
        if (!client.email) {
          client.email = normalizedEmail;
          shouldSave = true;
        }
        if (shouldSave) {
          await client.save();
        }
      }
    }

    const ticketQuery = { subject, channel: "email" };
    if (client) {
      ticketQuery.client = client._id;
    } else if (from) {
      ticketQuery.clientName = from;
    }

    let ticket = await Ticket.findOne(ticketQuery);
    const defaultTopic = "suporte";
    if (!ticket) {
      ticket = new Ticket({
        client: client ? client._id : undefined,
        clientName: client?.name || from,
        subject,
        topic: defaultTopic,
        channel: "email",
        messages: [{ message: text, fromClient: true }],
      });
    } else {
      ticket.messages.push({ message: text, fromClient: true });
      ticket.lastUpdate = new Date().toISOString();
      if (client && ticket.clientName !== client.name) {
        ticket.clientName = client.name || ticket.clientName;
      }
      if (
        !ticket.topic ||
        ticket.topic === "email" ||
        ticket.topic === "whatsapp"
      ) {
        ticket.topic = defaultTopic;
      }
    }

    await ticket.save();
    res.status(200).send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error");
  }
});

module.exports = router;
