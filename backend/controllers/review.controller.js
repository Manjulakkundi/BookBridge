// backend/controllers/review.controller.js

const Review   = require("../models/review.model");
const AppError = require("../utils/AppError");

// POST /api/v1/add-review
const addReview = async (req, res, next) => {
  try {
    const { bookId, user, comment, rating } = req.body;
    const review = new Review({ bookId, user, comment, rating });
    await review.save();
    res.status(201).json({ message: "Review added.", review });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/get-reviews/:bookId
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId }).sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { addReview, getReviews };
