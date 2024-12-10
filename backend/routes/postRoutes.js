const express = require("express");
const {
  createImagePost,
  createVideoPost,
  getAllPosts,
} = require("../controllers/postController");

const router = express.Router();

// POST: Create an image post
router.post("/image", createImagePost);

// POST: Create a video post
router.post("/video", createVideoPost);

// GET: Get all posts
router.get("/all", getAllPosts);

module.exports = router;
