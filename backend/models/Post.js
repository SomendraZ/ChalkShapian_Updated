const mongoose = require("mongoose");

// Base schema for common fields
const basePostSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    chalkName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    toolsUsed: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    filters: {
      type: [String],
      required: true,
      enum: [
        "Simple Design",
        "Creative Design",
        "Faces",
        "Architectures",
        "Weapons",
        "Others",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { discriminatorKey: "postType", timestamps: true }
);

// ImagePost schema
const imagePostSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
});

// VideoPost schema
const videoPostSchema = new mongoose.Schema({
  videoLink: {
    type: String,
    required: true,
  },
  coverImageUrl: {
    type: String,
    required: true,
  },
});

// Base model
const BasePost = mongoose.model("Post", basePostSchema);

// Specific models
const ImagePost = BasePost.discriminator("image", imagePostSchema);
const VideoPost = BasePost.discriminator("video", videoPostSchema);

module.exports = { ImagePost, VideoPost, BasePost };
