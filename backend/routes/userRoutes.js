const express = require("express");
const {
  registerUser,
  loginUser,
  verifyOtp,
} = require("../controllers/userController");

const router = express.Router();

// POST: Register user
router.post("/register", registerUser);

// POST: Login user
router.post("/login", loginUser);

// POST: Verify OTP
router.post("/verifyOtp", verifyOtp);

module.exports = router;
