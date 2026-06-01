// backend/routes/book.routes.js

const router = require("express").Router();
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/auth");
const { adminOnly }         = require("../middleware/adminOnly");
const { validate }          = require("../middleware/validate");
const {
  addBook, updateBook, deleteBook, getAllBooks, getRecentBooks, getBookById,
} = require("../controllers/book.controller");

// Validation rules
const bookValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("author").trim().notEmpty().withMessage("Author is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("url").isURL().withMessage("Cover image must be a valid URL"),
  body("desc").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
  body("language").trim().notEmpty().withMessage("Language is required"),
  body("genre").trim().notEmpty().withMessage("Genre is required"),
];

router.post("/add-book",    authenticateToken, adminOnly, bookValidation, validate, addBook);
router.put("/update-book",  authenticateToken, adminOnly, updateBook);
router.delete("/delete-book", authenticateToken, adminOnly, deleteBook);

router.get("/get-all-books",      getAllBooks);
router.get("/get-recent-books",   getRecentBooks);
router.get("/get-book-by-id/:id", getBookById);

module.exports = router;
