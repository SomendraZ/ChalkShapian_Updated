const express = require("express");
const {
  createImagePost,
  createVideoPost,
  getAllPosts,
  getPostById,
  getUserPosts,
} = require("../controllers/postController");

const router = express.Router();

// POST: Create an image post
router.post("/image", createImagePost);

// POST: Create a video post
router.post("/video", createVideoPost);

// GET: Get all posts
router.get("/all", getAllPosts);

// GET: Get post by ID
router.get("/:id", getPostById);

// GET: Get user posts
router.get("/user/:email", getUserPosts);

module.exports = router;
