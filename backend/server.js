// backend/server.js
// This file simply starts the server.
// Keeping it separate from app.js lets Jest import app.js cleanly without
// starting a real HTTP server during tests.

require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 BookBridge server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
});
