// Test script for MongoDB connection
require("dotenv").config();
const mongoose = require("mongoose");
const Ticket = require("./models/Ticket");

async function testMongoDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not set in environment");
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Test creating a ticket
    const ticket = new Ticket({
      clientName: "+5511999999999",
      subject: "Teste de mensagem",
      channel: "whatsapp",
      messages: [{ message: "Teste de mensagem", fromClient: true }],
    });

    const savedTicket = await ticket.save();
    console.log("Ticket saved:", savedTicket);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error:", error);
  }
}

testMongoDB();
