// backend/middleware/auth.js
// Verifies the JWT token sent with every protected request.
// Sets req.user = decoded token payload so controllers can use it.

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication token required. Please sign in." });
  }

  const token = authHeader.split(" ")[1];

  // Always read the secret from environment — NEVER hardcode it
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token expired or invalid. Please sign in again." });
    }
    // Attach decoded user info to req so every controller downstream can use it
    req.user = decoded; // contains: { userId, email, role, iat, exp }
    next();
  });
};

module.exports = { authenticateToken };
