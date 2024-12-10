const express = require("express");
const { getMessages, sendMessage } = require("../controllers/forumController");

const router = express.Router();

// GET: Get all messages
router.get("/messages", getMessages);

// POST: Send a message
router.post("/send", sendMessage);

module.exports = router;
