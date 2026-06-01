// backend/controllers/cart.controller.js

const User     = require("../models/user.model");
const AppError = require("../utils/AppError");

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/add-book-to-cart  (protected)
// ─────────────────────────────────────────────────────────────────────────────
const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.userId; // from JWT — not from headers
    const { bookid } = req.headers;

    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found.", 404));

    if (user.cart.includes(bookid)) {
      return res.status(200).json({ message: "Book is already in your cart." });
    }

    await User.findByIdAndUpdate(userId, { $push: { cart: bookid } });
    res.status(200).json({ message: "Book added to cart." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/remove-book-from-cart  (protected)
// ─────────────────────────────────────────────────────────────────────────────
const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { bookid } = req.headers;

    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found.", 404));

    if (!user.cart.includes(bookid)) {
      return next(new AppError("Book is not in your cart.", 404));
    }

    await User.findByIdAndUpdate(userId, { $pull: { cart: bookid } });
    res.status(200).json({ message: "Book removed from cart." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/get-cart  (protected)
// ─────────────────────────────────────────────────────────────────────────────
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("cart");
    if (!user) return next(new AppError("User not found.", 404));
    res.status(200).json({ message: "Cart fetched.", cart: user.cart });
  } catch (error) {
    next(error);
  }
};

module.exports = { addToCart, removeFromCart, getCart };
