const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const Client = require("../models/Client");

// GET all tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .sort({ updatedAt: -1 })
      .populate("client");
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single ticket
router.get("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("client");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new ticket
router.post("/", async (req, res) => {
  try {
    const {
      clientId,
      clientName,
      subject,
      channel,
      status,
      priority,
      messages,
      topic,
    } = req.body;

    const ticket = new Ticket({
      subject,
      channel,
      status: status || "novo",
      priority: priority || "media",
      topic: topic || "geral",
      messages: messages || [],
    });

    if (clientId) {
      const client = await Client.findById(clientId);
      if (!client) {
        return res.status(400).json({ message: "Client not found" });
      }
      ticket.client = client._id;
      ticket.clientName = client.name || client.email || client.whatsapp;
    } else {
      ticket.clientName = clientName;
    }

    const newTicket = await ticket.save();
    const populatedTicket = await newTicket.populate("client");
    res.status(201).json(populatedTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a ticket
router.put("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (req.body.clientId) {
      const client = await Client.findById(req.body.clientId);
      if (!client) {
        return res.status(400).json({ message: "Client not found" });
      }
      ticket.client = client._id;
      ticket.clientName = client.name || client.email || client.whatsapp;
    } else if (req.body.clientName) {
      ticket.client = undefined;
      ticket.clientName = req.body.clientName;
    }
    if (req.body.subject) ticket.subject = req.body.subject;
    if (req.body.topic) ticket.topic = req.body.topic;
    if (req.body.channel) ticket.channel = req.body.channel;
    if (req.body.status) ticket.status = req.body.status;
    if (req.body.priority) ticket.priority = req.body.priority;
    if (req.body.messages) ticket.messages = req.body.messages;
    ticket.lastUpdate = new Date().toISOString();

    const updatedTicket = await ticket.save();
    const populatedTicket = await updatedTicket.populate("client");
    res.json(populatedTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a ticket
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await ticket.remove();
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add message to ticket (for incoming messages)
router.post("/:id/messages", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.messages.push({
      message: req.body.message,
      fromClient:
        typeof req.body.fromClient === "boolean" ? req.body.fromClient : true,
    });
    if (req.body.topic) {
      ticket.topic = req.body.topic;
    }
    ticket.lastUpdate = new Date().toISOString();

    const updatedTicket = await ticket.save();
    const populatedTicket = await updatedTicket.populate("client");
    res.json(populatedTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update status only
router.patch("/:id/status", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    ticket.status = status;
    ticket.lastUpdate = new Date().toISOString();

    const updatedTicket = await ticket.save();
    const populatedTicket = await updatedTicket.populate("client");
    res.json(populatedTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
