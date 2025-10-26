# Contact Hub Zen Backend

Backend para o sistema de atendimento multicanal usando Node.js, Express, MongoDB Atlas.

## Setup

1. Instale as dependências:

   ```
   npm install
   ```

2. Configure o MongoDB Atlas:

   - Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas).
   - Crie um cluster e um banco de dados.
   - Obtenha a connection string e substitua no `.env`:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/contacthub?retryWrites=true&w=majority
     ```

3. Configure o Twilio para WhatsApp:

   - Crie uma conta no [Twilio](https://www.twilio.com/).
   - Ative o WhatsApp Sandbox ou compre um número.
   - Obtenha Account SID, Auth Token e o número WhatsApp.
   - Atualize o `.env`:
     ```
     TWILIO_ACCOUNT_SID=your_account_sid
     TWILIO_AUTH_TOKEN=your_auth_token
     TWILIO_WHATSAPP_NUMBER=+1234567890
     ```
   - Configure o webhook no Twilio Dashboard para POST em `https://yourdomain.com/api/integrations/whatsapp`.

4. Para receber emails:

   - Use um serviço como SendGrid ou Mailgun.
   - Configure webhooks para POST em `/api/integrations/email`.

5. Execute o servidor:
   ```
   npm run dev
   ```

O servidor roda na porta 5000.

## APIs

- GET /api/tickets - Lista todos os tickets
- POST /api/tickets - Cria um novo ticket
- PUT /api/tickets/:id - Atualiza um ticket
- DELETE /api/tickets/:id - Deleta um ticket
- POST /api/tickets/:id/messages - Adiciona mensagem a um ticket
- POST /api/integrations/whatsapp - Webhook para WhatsApp (Twilio)
- POST /api/integrations/whatsapp/send - Enviar mensagem WhatsApp (para atendentes)
- POST /api/integrations/email - Webhook para emails
