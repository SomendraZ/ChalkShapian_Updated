const jwt = require("jsonwebtoken");

// Middleware to check if the user is authenticated
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    // Token is missing (null or undefined)
    return res
      .status(401)
      .json({ message: "User not found. Please login first." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Token is invalid (malformed or expired)
    res.status(400).json({ message: "Invalid token. Please login again." });
  }
};

module.exports = verifyToken;
