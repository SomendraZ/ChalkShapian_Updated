const express = require("express");
const {
  createImagePost,
  createVideoPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  toggleLikePost,
  deletePost,
} = require("../controllers/postController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// POST: Create an image post
router.post("/image", verifyToken, createImagePost);

// POST: Create a video post
router.post("/video", verifyToken, createVideoPost);

// GET: Get all posts
router.get("/all", verifyToken, getAllPosts);

// GET: Get post by ID
router.get("/:id", verifyToken, getPostById);

// GET: Get user posts by email
router.get("/user/:email", verifyToken, getUserPosts);

// POST: Toggle like on a post by ID
router.post("/toggleLike/:postId", verifyToken, toggleLikePost);

// DELETE: Delete a post by ID
router.delete("/:postId", verifyToken, deletePost);

module.exports = router;
