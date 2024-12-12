const Forum = require("../models/Forum");

// Get all messages
const getMessages = async (req, res) => {
  console.log("Received request to get all messages.");

  try {
    const messages = await Forum.find();
    console.log("Messages retrieved successfully.");
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  const { sender, text, datetime } = req.body;

  console.log(`Received a request to send a message from: ${sender}.`);

  const message = new Forum({ sender, text, datetime });

  try {
    const newMessage = await message.save();
    console.log("Message saved successfully:", newMessage);

    // Use the io instance passed through the request
    req.io.emit("newMessage", newMessage);
    console.log("Message broadcasted to connected clients.");

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getMessages, sendMessage };
