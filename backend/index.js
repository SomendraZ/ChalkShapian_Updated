const express = require("express");
const http = require("http"); // For creating a server
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const forumRoutes = require("./routes/forumRoutes");

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize the app
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this for production
    methods: ["GET", "POST"],
  },
});

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

// Simple route
app.get("/", (req, res) => {
  res.send("Chalk Shapian API is running...");
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
