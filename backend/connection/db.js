// backend/connection/db.js
// Establishes the connection to MongoDB.
// This file is required once in app.js and handles all connection events.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails — app cannot run without it
  }
};

// Log any connection errors that happen after the initial connection
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected");
});

connectDB();

module.exports = mongoose.connection;
