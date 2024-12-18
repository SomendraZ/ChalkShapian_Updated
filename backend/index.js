const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const forumRoutes = require("./routes/forumRoutes");
const verifySocketToken = require("./middleware/verifySocketToken");

dotenv.config(); // Load environment variables

const CLIENT_URL = process.env.CLIENT_URL;

// Ensure Cloudinary is properly configured
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
connectDB();

// Initialize the app
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: `${CLIENT_URL}`,
    methods: ["GET", "POST"],
  },
});

// Apply the socket verification middleware
io.use(verifySocketToken);

app.use(cors());
app.use(express.json());

// User routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use(
  "/api/forum",
  (req, res, next) => {
    req.io = io;
    next();
  },
  forumRoutes
);

app.get("/", (req, res) => {
  res.send("Chalk Shapian API is running...");
});

io.on("connection", (socket) => {
  console.log("A user connected with chalkName:", socket.user.chalkName);

  socket.on("disconnect", () => {
    console.log("A user disconnected with chalkName:", socket.user.chalkName);
  });

  // Example: Handle new messages
  socket.on("newMessage", (message) => {
    console.log("Received message:", message);
    socket.broadcast.emit("newMessage", message); // Broadcast message to other users
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
