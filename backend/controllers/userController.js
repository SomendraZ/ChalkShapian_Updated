const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendOtpEmail } = require("../utils/emailService"); // Function to send OTP email

// Registration Logic
const registerUser = async (req, res) => {
  const { fullName, chalkName, email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { chalkName }],
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === email ? "email" : "chalkName";
      return res.status(400).json({
        success: false,
        message: `User already exists with the same ${conflictField}.`,
      });
    }

    // Validate chalkName length
    if (chalkName.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Chalk Name must not exceed 10 characters.",
      });
    }

    // Validate password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#!])[A-Za-z\d@$!%*?&#!]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      fullName,
      chalkName,
      email,
      password: hashedPassword,
    });

    // Save user
    await user.save();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    // Send OTP via email
    await sendOtpEmail(user.email, otp);

    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email for OTP verification.",
    });
  } catch (err) {
    console.error("Error in registration:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login Logic with OTP check
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check if user is verified
    if (user.isVerified === false) {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate new OTP
      const otpExpiration = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
      user.otp = otp;
      user.otpExpiration = otpExpiration;
      await user.save();

      // Send OTP via email
      await sendOtpEmail(user.email, otp);

      return res.status(401).json({
        message: "User is not verified. Please check your email for OTP.",
      });
    }

    // Generate JWT Token
    const payload = {
      id: user._id,
      chalkName: user.chalkName,
      isAdmin: user.isAdmin,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "1h",
    });

    return res.json({
      message: "Login successful.",
      chalkName: user.chalkName,
      email: user.email,
      token,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    });
  } catch (err) {
    console.error("Error in login:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// OTP Verification Logic
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    // Check if OTP matches and is within expiration time
    if (user.otp === otp && Date.now() < user.otpExpiration) {
      // Mark user as verified
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiration = undefined;
      await user.save();

      // Generate JWT Token
      const payload = {
        id: user._id,
        chalkName: user.chalkName,
        isAdmin: user.isAdmin,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY || "1h",
      });

      return res.json({
        message: "OTP verified successfully, you are now verified.",
        chalkName: user.chalkName,
        email: user.email,
        token,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      });
    } else {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }
  } catch (err) {
    console.error("Error during OTP verification:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, verifyOtp };
