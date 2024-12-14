const express = require("express");
const { getMessages, sendMessage } = require("../controllers/forumController");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET: Get all messages
router.get("/messages", verifyToken, getMessages);

// POST: Send a message
router.post("/send", verifyToken, sendMessage);

module.exports = router;
