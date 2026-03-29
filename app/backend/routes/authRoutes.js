const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

// ==========================
// AUTH ROUTES
// ==========================

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Verify Email
router.get("/verify/:token", verifyEmail);

//Forgot Password
router.post("/forgot-password", forgotPassword);

//Password Reset
router.post("/reset-password/:token", resetPassword);

// Test Route (optional)
router.get("/", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

module.exports = router;
