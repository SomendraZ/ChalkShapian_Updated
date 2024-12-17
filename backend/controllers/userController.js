const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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

    await user.save();

    // Generate token
    const payload = {
      id: user._id,
      chalkName: user.chalkName,
      isAdmin: false,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || "1h",
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      chalkName: user.chalkName,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error("Error in registration:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

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

    // Generate JWT Token
    const payload = {
      id: user._id,
      chalkName: user.chalkName,
      isAdmin: user.isAdmin,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Send token to the client
    res.json({
      message: "Login successful.",
      token,
      chalkName: user.chalkName,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error(`Error in login: ${err.message}`);
    res.status(500).send("Server error");
  }
};

module.exports = { registerUser, loginUser };
