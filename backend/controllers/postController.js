const { ImagePost, VideoPost, BasePost } = require("../models/Post");

// Create an image post
const createImagePost = async (req, res) => {
  const {
    title,
    toolsUsed,
    artist,
    description,
    filters,
    imageUrl,
    email,
    chalkName,
  } = req.body;

  console.log(`Image post creation request received from email: ${email}`);

  try {
    // Validate fields
    if (
      !title ||
      !toolsUsed ||
      !artist ||
      !description ||
      !imageUrl ||
      !filters ||
      !email ||
      !chalkName
    ) {
      console.error(`Validation failed. Missing required fields.`);
      return res.status(400).json({ message: "All fields are required." });
    }

    console.log(`Validation successful for image post.`);

    // Create new image post
    const post = new ImagePost({
      title,
      toolsUsed,
      artist,
      description,
      filters,
      imageUrl,
      email,
      chalkName,
    });

    console.log(`Saving new image post to database.`);
    await post.save();

    console.log(`Image post created successfully.`, post);
    res.status(201).json({ message: "Image post created successfully." });
  } catch (err) {
    console.error(
      `Error in creating image post for email: ${email}`,
      err.stack
    );
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Create a video post
const createVideoPost = async (req, res) => {
  const {
    title,
    videoLink,
    toolsUsed,
    artist,
    description,
    filters,
    coverImageUrl,
    email,
    chalkName,
  } = req.body;

  console.log(`Video post creation request received from email: ${email}`);

  try {
    // Validate fields
    if (
      !title ||
      !videoLink ||
      !artist ||
      !description ||
      !coverImageUrl ||
      !filters ||
      !email ||
      !chalkName
    ) {
      console.error(`Validation failed. Missing required fields.`);
      return res.status(400).json({ message: "All fields are required." });
    }

    console.log(`Validation successful for video post.`);

    // Create new video post
    const post = new VideoPost({
      title,
      videoLink,
      toolsUsed,
      artist,
      description,
      filters,
      coverImageUrl,
      email,
      chalkName,
    });

    console.log(`Saving new video post to database.`);
    await post.save();

    console.log(`Video post created successfully.`);
    res.status(201).json({ message: "Video post created successfully.", post });
  } catch (err) {
    console.error(
      `Error in creating video post for email: ${email}`,
      err.stack
    );
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    console.log("Fetching all posts...");

    // Query all posts from the base model
    const posts = await BasePost.find().sort({ createdAt: -1 });

    console.log(`Total posts fetched: ${posts.length}`);
    res.status(200).json({ message: "Posts retrieved successfully.", posts });
  } catch (err) {
    console.error("Error fetching posts:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createImagePost, createVideoPost, getAllPosts };
