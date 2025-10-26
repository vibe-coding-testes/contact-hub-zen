// Test script for WhatsApp webhook
const axios = require("axios");

async function testWhatsAppWebhook() {
  try {
    const response = await axios.post(
      "http://localhost:5001/api/integrations/whatsapp",
      {
        From: "whatsapp:+5511999999999",
        Body: "Teste de mensagem",
        To: "whatsapp:+19062561732",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Response:", response.data);
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

testWhatsAppWebhook();
