// backend/app.js
// This file sets up the Express application.
// It does NOT call app.listen() — that is done in server.js.
// This separation allows Jest tests to import the app without starting a server.

const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./connection/db"); // connect to MongoDB

// Route imports
const userRoutes      = require("./routes/user.routes");
const bookRoutes      = require("./routes/book.routes");
const cartRoutes      = require("./routes/cart.routes");
const orderRoutes     = require("./routes/order.routes");
const favouriteRoutes = require("./routes/favourite.routes");
const reviewRoutes    = require("./routes/review.routes");

// Error handler (must be imported last)
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Allow requests from local frontend dev server AND deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://bookbridge-frontend.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", favouriteRoutes);
app.use("/api/v1", reviewRoutes);

// Health check — useful for Render and CI
app.get("/", (req, res) => {
  res.json({ message: "📚 BookBridge API is running!" });
});

// 404 handler — catches any unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// MUST be last — Express identifies error handlers by their 4 parameters
app.use(errorHandler);

module.exports = app;
