// backend/controllers/user.controller.js
// All user-related business logic lives here.
// Routes just call these functions — no logic in routes files.

const crypto   = require("crypto");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const User     = require("../models/user.model");
const OTP      = require("../models/otp.model");
const AppError = require("../utils/AppError");
const { sendOTPEmail } = require("../utils/sendEmail");

// ─── Helper ───────────────────────────────────────────────────────────────────
// Generates a cryptographically secure 6-digit OTP
const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/sign-up
// Creates a new user account and sends an OTP for email verification.
// ─────────────────────────────────────────────────────────────────────────────
const signUp = async (req, res, next) => {
  try {
    const { username, email, password, address, phoneNumber } = req.body;

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email is already registered.", 400));
    }

    // Hash password — bcrypt salt rounds: 12 is secure and reasonably fast
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save the new user
    const newUser = new User({ username, email, password: hashedPassword, address, phoneNumber });
    await newUser.save();

    // Delete any old unused OTPs for this email
    await OTP.deleteMany({ email, verified: false });

    // Generate and store a new OTP (expires in 10 minutes)
    const otp = generateOTP();
    await new OTP({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    }).save();

    // Send the OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "Account created! OTP sent to your email." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/verify-otp
// Verifies the OTP entered by the user after sign-up.
// ─────────────────────────────────────────────────────────────────────────────
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ email, verified: false }).sort({ expiresAt: -1 });

    if (!otpRecord) {
      return next(new AppError("OTP not found. Please request a new one.", 400));
    }

    if (new Date() > otpRecord.expiresAt) {
      return next(new AppError("OTP has expired. Please request a new one.", 400));
    }

    if (otp.trim() !== otpRecord.otp.trim()) {
      return next(new AppError("Invalid OTP. Please try again.", 400));
    }

    otpRecord.verified = true;
    await otpRecord.save();

    res.status(200).json({ message: "Email verified successfully! You can now sign in." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/v1/sign-in
// Authenticates user and returns a JWT token.
// ─────────────────────────────────────────────────────────────────────────────
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("No account found with this email.", 400));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Incorrect password.", 401));
    }

    // Sign the JWT — include userId, email, role so middleware can use them
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,  // NEVER hardcode this
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id:       user._id,
        email:    user.email,
        username: user.username,
        role:     user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/get-user-information  (protected)
// Returns full user profile for the logged-in user.
// ─────────────────────────────────────────────────────────────────────────────
const getUserInfo = async (req, res, next) => {
  try {
    // req.user.userId is set by the authenticateToken middleware
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return next(new AppError("User not found.", 404));
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/v1/update-address  (protected)
// Updates the address of the logged-in user.
// ─────────────────────────────────────────────────────────────────────────────
const updateAddress = async (req, res, next) => {
  try {
    const { address } = req.body;
    if (!address) return next(new AppError("Address is required.", 400));

    await User.findByIdAndUpdate(req.user.userId, { address });
    res.status(200).json({ message: "Address updated successfully." });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/v1/get-all-users  (admin only)
// Returns all users — for the admin dashboard.
// ─────────────────────────────────────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ status: "Success", data: users });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUp, verifyOTP, signIn, getUserInfo, updateAddress, getAllUsers };
