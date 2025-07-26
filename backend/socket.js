let io;
const userLocations = {}; // Maps socket.id -> { lat, lon }
const userSockets = {}; // Maps username -> socket.id

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: "*", // Allow all origins for simplicity
        methods: ["GET", "POST"]
      }
    });

    io.on('connection', (socket) => {
      // A user registers their username for notifications
      socket.on('register-user', (username) => {
        userSockets[username] = socket.id;
        console.log(`✅ User registered: ${username} with socket ${socket.id}`);
      });

      // A user sends their location
      socket.on('user-location', (location) => {
        userLocations[socket.id] = location;
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        // Find and remove user from username mapping
        for (const username in userSockets) {
          if (userSockets[username] === socket.id) {
            delete userSockets[username];
            console.log(`🔌 User disconnected: ${username}`);
            break;
          }
        }
        // Remove user from location mapping
        if (userLocations[socket.id]) {
          delete userLocations[socket.id];
        }
      });
    });

    return io;
  },
  getIO: () => { if (!io) { throw new Error("Socket.io not initialized!"); } return io; },
  getLocations: () => userLocations,
  getUserSocketId: (username) => userSockets[username]
};