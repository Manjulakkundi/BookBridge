// backend/routes/favourite.routes.js

const router = require("express").Router();
const { authenticateToken } = require("../middleware/auth");
const { addToFavourites, removeFromFavourites, getFavourites } =
  require("../controllers/favourite.controller");

router.put("/add-book-to-favourites",         authenticateToken, addToFavourites);
router.delete("/remove-book-from-favourites", authenticateToken, removeFromFavourites);
router.get("/get-favourite-books",            authenticateToken, getFavourites);

module.exports = router;
