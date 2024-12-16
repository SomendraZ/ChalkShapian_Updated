const cloudinary = require("cloudinary").v2;

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

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { isAdmin, email } = req.user;

  console.log(`Delete request received for post: ${postId} by user: ${email}`);

  try {
    // Find the post by ID
    const post = await BasePost.findById(postId).exec();

    if (!post) {
      console.log(`Post with ID ${postId} not found.`);
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if the user is authorized to delete the post
    if (isAdmin || post.email === email) {
      console.log(
        isAdmin
          ? `Admin ${email} is deleting the post.`
          : `User ${email} is deleting their own post.`
      );

      // Extract user emails who liked this post
      const likedByEmails = post.likes;

      // Step 1: Delete the image from Cloudinary
      // Split the URL and extract the filename (including extension)
      const filename = post.imageUrl.split("/").pop(); // Get filename with extension

      // Decode the filename (to handle characters like '%40' for '@')
      const decodedFileName = decodeURIComponent(filename);

      // Split the decoded filename to separate the publicId from the file extension
      const urlSegments = decodedFileName.split(".");

      // The publicId is the filename without the extension
      const publicId = urlSegments.slice(0, urlSegments.length - 1).join(".");

      console.log("Extracted publicId for deletion:", publicId);
      try {
        const cloudinaryResult = await cloudinary.uploader.destroy(publicId);
        console.log(
          `Cloudinary image deleted successfully: ${
            cloudinaryResult.result || cloudinaryResult.message
          }`
        );
      } catch (cloudinaryError) {
        console.error(
          `Error deleting image from Cloudinary: ${cloudinaryError.message}`
        );
        return res
          .status(500)
          .json({ message: "Error deleting image from Cloudinary." });
      }

      // Step 2: After successful image deletion, delete the post from the database
      await post.deleteOne();

      // Step 3: Remove post from the creator's posts array
      await User.findOneAndUpdate(
        { email: post.email },
        { $pull: { posts: postId } }
      );

      // Step 4: Remove post from the likedPosts array for all users who liked it
      if (likedByEmails.length > 0) {
        // Find and log affected users
        const affectedUsers = await User.find(
          { email: { $in: likedByEmails } },
          { email: 1, likedPosts: 1 }
        ).exec();

        // Perform the update to remove the post from likedPosts
        await User.updateMany(
          { email: { $in: likedByEmails } },
          { $pull: { likedPosts: postId } }
        );

        // Log the users whose likedPosts were updated
        console.log("Users affected by the removal of post from likedPosts:");
        affectedUsers.forEach((user) =>
          console.log(`- Email: ${user.email}, LikedPosts: ${user.likedPosts}`)
        );
      }

      console.log(`Post with ID ${postId} deleted successfully.`);
      return res.status(200).json({ message: "Post deleted successfully." });
    } else {
      console.log(
        `User ${email} is unauthorized to delete post with ID: ${postId}.`
      );
      return res.status(403).json({ message: "Access denied." });
    }
  } catch (err) {
    console.error(`Error deleting post with ID ${postId}:`, err.stack);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createImagePost,
  createVideoPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  toggleLikePost,
  deletePost,
};
