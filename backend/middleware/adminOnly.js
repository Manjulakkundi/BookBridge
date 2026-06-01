// backend/middleware/adminOnly.js
// Checks that the authenticated user has the "admin" role.
// ALWAYS use authenticateToken BEFORE this middleware in a route.
// Example: router.post("/add-book", authenticateToken, adminOnly, addBook)

const adminOnly = (req, res, next) => {
  // req.user is set by authenticateToken middleware
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { adminOnly };
