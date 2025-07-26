'use strict';

let io;
const userLocations = {}; // In-memory store: { socketId: { lat, lon } }

module.exports = {
  init: (httpServer) => {
    io = require('socket.io')(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      // Listen for a user to send their location
      socket.on('user-location', (location) => {
        userLocations[socket.id] = location;
        console.log(`📍 Location received for ${socket.id}:`, location);
      });

      // Clean up when a user disconnects
      socket.on('disconnect', () => {
        delete userLocations[socket.id];
        console.log(`❌ Client disconnected, removed location for ${socket.id}`);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  },
  getLocations: () => {
    return userLocations;
  },
};