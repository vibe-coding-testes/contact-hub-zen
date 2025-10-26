require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.MONGODB_DB_NAME || "contacthub",
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const ticketRoutes = require("./routes/tickets");
const integrationRoutes = require("./routes/integrations");
app.use("/api/tickets", ticketRoutes);
app.use("/api/integrations", integrationRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Contact Hub Backend API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
