const bcrypt = require("bcryptjs");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const { fullName, chalkName, email, password } = req.body;

  console.log("Register request received with:", {
    fullName,
    chalkName,
    email,
  });

  try {
    // Check if the user already exists by email and chalkName
    const existingEmailUser = await User.findOne({ email });

    const existingChalkNameUser = await User.findOne({ chalkName });
    console.log(`Checked for existing user by chalkName: ${chalkName}.`);

    if (existingEmailUser && existingChalkNameUser) {
      console.log("User exists with same email and chalkname.");
      return res.status(400).json({
        message: "User already exists with the same email and chalkname.",
      });
    } else if (existingEmailUser) {
      console.log("User exists with same email.");
      return res.status(400).json({
        message: "User already exists with the same email.",
      });
    } else if (existingChalkNameUser) {
      console.log("User exists with same chalkname.");
      return res.status(400).json({
        message: "User already exists with the same chalkname.",
      });
    }

    // Create new user
    const user = new User({
      fullName,
      chalkName,
      email,
      password,
    });
    console.log(`Created new user object for ${user.chalkName}.`);

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    console.log("Generated salt for password hashing.");

    user.password = await bcrypt.hash(password, salt);

    await user.save();
    console.log("User saved successfully to the database.");

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error in registration:", err.message);
    res.status(500).send("Server error");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(`Login request received with email: ${email}.`);

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`No user exists with that email: ${email}.`);
      return res
        .status(400)
        .json({ message: "No user exists with that email." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match status: ${isMatch}.`);

    if (!isMatch) {
      console.log("Incorrect password.");
      return res.status(400).json({ message: "Incorrect password." });
    }

    // Send success response with chalkName
    console.log(`Login successful, returning chalkName: ${user.chalkName}.`);
    res.json({ message: "Login successful.", chalkName: user.chalkName });
  } catch (err) {
    console.error(`Error in login: ${err.message}.`);
    res.status(500).send("Server error");
  }
};

module.exports = { registerUser, loginUser };
