// backend/routes/cart.routes.js

const router = require("express").Router();
const { authenticateToken }              = require("../middleware/auth");
const { addToCart, removeFromCart, getCart } = require("../controllers/cart.controller");

router.put("/add-book-to-cart",         authenticateToken, addToCart);
router.delete("/remove-book-from-cart", authenticateToken, removeFromCart);
router.get("/get-cart",                 authenticateToken, getCart);

module.exports = router;
