const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { fullName, chalkName, email, password } = req.body;

  try {
    // Check if the user already exists by email or chalkName
    const existingUser = await User.findOne({
      $or: [{ email }, { chalkName }],
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === email ? "email" : "chalkName";
      return res.status(400).json({
        message: `User already exists with the same ${conflictField}.`,
      });
    }

    // Validate password complexity
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      fullName,
      chalkName,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate JWT Token
    const payload = {
      id: user._id,
      chalkName: user.chalkName,
      isAdmin: false,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token and user info to the client
    res.status(201).json({
      message: "User registered successfully.",
      token,
      chalkName: user.chalkName,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error("Error in registration:", err.message);
    res.status(500).send("Server error");
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
