const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["whatsapp", "phone", "email"],
      required: true,
    },
    value: { type: String, required: true },
  },
  { _id: false }
);

const clientSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, index: true, sparse: true },
    whatsapp: { type: String, index: true, sparse: true },
    phones: [{ type: String }],
    contacts: [contactSchema],
    notes: { type: String },
  },
  { timestamps: true }
);

clientSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Client", clientSchema);
