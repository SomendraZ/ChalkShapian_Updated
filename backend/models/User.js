const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    isAdmin: { type: Boolean, default: false },
    fullName: { type: String, required: true, trim: true },
    chalkName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
