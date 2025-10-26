const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    clientName: {
      type: String,
      required: function () {
        return !this.client;
      },
    },
    subject: { type: String, required: true },
    topic: { type: String, default: "geral" },
    channel: {
      type: String,
      enum: ["whatsapp", "email", "chat"],
      required: true,
    },
    status: {
      type: String,
      enum: ["novo", "em_andamento", "resolvido"],
      default: "novo",
    },
    priority: {
      type: String,
      enum: ["baixa", "media", "alta"],
      default: "media",
    },
    lastUpdate: { type: String, default: new Date().toISOString() },
    messages: [
      {
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        fromClient: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

// Ensure API responses use `id` instead of `_id`
ticketSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Ticket", ticketSchema);
