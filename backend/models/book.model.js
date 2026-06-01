// backend/models/book.model.js

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "Cover image URL is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    price: {
      type: Number,          // FIXED: Number not String
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
