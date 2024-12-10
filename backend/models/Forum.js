const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    text: { type: String, required: true },
    datetime: { type: String, required: true },
  },
  { timestamps: true }
);

const Forum = mongoose.model("Forum", forumSchema);
module.exports = Forum;
