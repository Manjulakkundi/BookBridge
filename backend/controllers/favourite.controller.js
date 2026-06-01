// backend/controllers/favourite.controller.js

const User     = require("../models/user.model");
const AppError = require("../utils/AppError");

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/add-book-to-favourites  (protected)
// ─────────────────────────────────────────────────────────────────────────────
const addToFavourites = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { bookid } = req.headers;

    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found.", 404));

    if (user.favourites.includes(bookid)) {
      return res.status(200).json({ message: "Book is already in favourites." });
    }

    await User.findByIdAndUpdate(userId, { $push: { favourites: bookid } });
    res.status(200).json({ message: "Book added to favourites." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/remove-book-from-favourites  (protected)
// ─────────────────────────────────────────────────────────────────────────────
const removeFromFavourites = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { bookid } = req.headers;

    const user = await User.findById(userId);
    if (!user) return next(new AppError("User not found.", 404));

    if (!user.favourites.includes(bookid)) {
      return next(new AppError("Book not found in favourites.", 404));
    }

    await User.findByIdAndUpdate(userId, { $pull: { favourites: bookid } });
    res.status(200).json({ message: "Book removed from favourites." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/get-favourite-books  (protected)
// ─────────────────────────────────────────────────────────────────────────────
const getFavourites = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate("favourites");
    if (!user) return next(new AppError("User not found.", 404));
    res.status(200).json({ status: "Success", favourites: user.favourites });
  } catch (error) {
    next(error);
  }
};

module.exports = { addToFavourites, removeFromFavourites, getFavourites };
