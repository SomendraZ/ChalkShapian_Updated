const jwt = require("jsonwebtoken");

// Middleware to verify socket token
const verifySocketToken = (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error("Access denied. No token provided."));
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Invalid token."));
  }
};

module.exports = verifySocketToken;
