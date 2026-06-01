// backend/routes/user.routes.js
// Pure routing — no business logic here.

const router = require("express").Router();
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/auth");
const { adminOnly }         = require("../middleware/adminOnly");
const { validate }          = require("../middleware/validate");
const {
  signUp, verifyOTP, signIn, getUserInfo, updateAddress, getAllUsers,
} = require("../controllers/user.controller");

// Validation rules for sign-up
const signUpValidation = [
  body("username").trim().isLength({ min: 4 }).withMessage("Username must be at least 4 characters"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("phoneNumber").matches(/^\d{10}$/).withMessage("Phone number must be 10 digits"),
  body("address").trim().notEmpty().withMessage("Address is required"),
];

const signInValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/sign-up",  signUpValidation, validate, signUp);
router.post("/verify-otp", verifyOTP);
router.post("/sign-in",  signInValidation, validate, signIn);

router.get("/get-user-information", authenticateToken, getUserInfo);
router.put("/update-address",       authenticateToken, updateAddress);
router.get("/get-all-users",        authenticateToken, adminOnly, getAllUsers);

module.exports = router;
