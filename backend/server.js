require('dotenv').config();
const http = require("http");
const app = require("./app");
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.IO using our new module
const socketManager = require('./socket');
const io = socketManager.init(server);
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully.');
    server.listen(PORT, () => {
      console.log(`🚀 Server is live and listening on http://localhost:${PORT}`);
      console.log("Waiting for connections...");
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  });
