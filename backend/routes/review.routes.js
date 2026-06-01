// backend/routes/review.routes.js

const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { addReview, getReviews } = require("../controllers/review.controller");

router.post("/add-review",          authenticateToken, addReview);
router.get("/get-reviews/:bookId",  getReviews);

module.exports = router;
