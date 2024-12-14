const { ImagePost, VideoPost, BasePost } = require("../models/Post");
const User = require("../models/User");

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

    await User.findOneAndUpdate(
      { email, chalkName },
      { $push: { posts: post._id } },
      { new: true }
    );
    console.log(`Post ID added to user's postIds array.`);

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

    await User.findOneAndUpdate(
      { email, chalkName },
      { $push: { posts: post._id } },
      { new: true }
    );
    console.log(`Post ID added to user's postIds array.`);

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

// Get post by ID
const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Fetching post with ID: ${id}`);

    // Query post by ID
    const post = await BasePost.findById(id);

    if (!post) {
      console.error(`Post with ID ${id} not found.`);
      return res.status(404).json({ message: "Post not found." });
    }

    console.log(`Post found: ${post}`);
    res.status(200).json({ message: "Post retrieved successfully.", post });
  } catch (err) {
    console.error(`Error fetching post with ID ${id}:`, err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get User Posts
const getUserPosts = async (req, res) => {
  const { email } = req.params;

  console.log(`Received request to fetch posts for user with email: ${email}`);

  try {
    // Find the user and populate the posts array
    console.log("Searching for user in the database...");
    const user = await User.findOne({ email }).populate("posts");

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(404).json({ message: "User not found." });
    }

    console.log(
      `User found with email: ${email}. Number of posts: ${user.posts.length}`
    );

    // Return the user's posts
    res.status(200).json({
      message: "User's posts retrieved successfully.",
      posts: user.posts,
    });
  } catch (err) {
    console.error("Error fetching user's posts:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const toggleLikePost = async (req, res) => {
  const { postId } = req.params;
  const email = req.user.email;

  console.log(`Toggling like for post: ${postId} by user: ${email}`);

  try {
    // Find the post by ID
    const post = await BasePost.findById(postId);
    if (!post) {
      console.log(`Post with ID ${postId} not found.`);
      return res.status(404).json({ message: "Post not found." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User with email ${email} not found.`);
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user has already liked the post
    if (post.likes.includes(email)) {
      // If already liked, unlike the post
      console.log(`User ${email} has already liked the post, unliking...`);
      user.likedPosts = user.likedPosts.filter(
        (id) => id.toString() !== postId.toString()
      );
      await user.save();

      post.likes = post.likes.filter((like) => like !== email);
      await post.save();

      console.log(`Post ${postId} unliked successfully by user: ${email}`);
      return res
        .status(200)
        .json({ message: "Post unliked successfully.", post });
    } else {
      // If not liked, like the post
      console.log(`User ${email} has not liked the post, liking...`);
      user.likedPosts.push(postId);
      await user.save();

      post.likes.push(email);
      await post.save();

      console.log(`Post ${postId} liked successfully by user: ${email}`);
      return res
        .status(200)
        .json({ message: "Post liked successfully.", post });
    }
  } catch (err) {
    console.error("Error toggling like for post:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createImagePost,
  createVideoPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  toggleLikePost,
};
