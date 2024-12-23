const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user._id,
    chalkName: user.chalkName,
    isAdmin: user.isAdmin,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || "1h",
  });
};

module.exports = { generateToken };
