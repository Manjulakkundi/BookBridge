// backend/controllers/book.controller.js
// All book-related business logic.

const Book     = require("../models/book.model");
const AppError = require("../utils/AppError");

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/add-book  (admin only)
// ─────────────────────────────────────────────────────────────────────────────
const addBook = async (req, res, next) => {
  try {
    const { url, title, author, price, desc, language, genre } = req.body;
    const newBook = new Book({ url, title, author, price: Number(price), desc, language, genre });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully.", book: newBook });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/update-book  (admin only)
// ─────────────────────────────────────────────────────────────────────────────
const updateBook = async (req, res, next) => {
  try {
    const { bookid } = req.headers;
    const currentBook = await Book.findById(bookid);
    if (!currentBook) return next(new AppError("Book not found.", 404));

    const allowedFields = ["url", "title", "author", "price", "desc", "language", "genre"];
    const updatedFields = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined && String(req.body[field]) !== String(currentBook[field])) {
        updatedFields[field] = field === "price" ? Number(req.body[field]) : req.body[field];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      return next(new AppError("No changes detected.", 400));
    }

    const updated = await Book.findByIdAndUpdate(bookid, updatedFields, { new: true });
    res.status(200).json({ message: "Book updated successfully.", book: updated });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/v1/delete-book  (admin only)
// ─────────────────────────────────────────────────────────────────────────────
const deleteBook = async (req, res, next) => {
  try {
    const { bookid } = req.headers;
    const book = await Book.findByIdAndDelete(bookid);
    if (!book) return next(new AppError("Book not found.", 404));
    res.status(200).json({ message: `"${book.title}" deleted successfully.` });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/get-all-books?page=1&limit=12
// Supports pagination so we don't load all books at once.
// ─────────────────────────────────────────────────────────────────────────────
const getAllBooks = async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12); // cap at 50
    const skip  = (page - 1) * limit;

    // Run both queries at the same time using Promise.all for speed
    const [books, total] = await Promise.all([
      Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Book.countDocuments(),
    ]);

    res.json({
      status: "Success",
      data: books,
      pagination: {
        currentPage:  page,
        totalPages:   Math.ceil(total / limit),
        totalBooks:   total,
        hasNextPage:  page < Math.ceil(total / limit),
        hasPrevPage:  page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/get-recent-books
// Returns the 4 most recently added books for the homepage.
// ─────────────────────────────────────────────────────────────────────────────
const getRecentBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(4);
    res.json({ status: "Success", data: books });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/get-book-by-id/:id
// Returns a single book by its MongoDB ID.
// ─────────────────────────────────────────────────────────────────────────────
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return next(new AppError("Book not found.", 404));
    res.json({ status: "Success", data: book });
  } catch (error) {
    next(error);
  }
};

module.exports = { addBook, updateBook, deleteBook, getAllBooks, getRecentBooks, getBookById };
