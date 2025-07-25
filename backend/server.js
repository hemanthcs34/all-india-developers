// server.js
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = require("./app"); // use your app.js
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });

  socket.on("motionDetected", (data) => {
    console.log("📸 Motion Detected:", data);
    io.emit("alert", { message: "Motion detected!", data });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
