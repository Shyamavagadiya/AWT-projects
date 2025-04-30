// File: index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle user joining with a username
  socket.on('join', (username) => {
    socket.username = username;
    io.emit('message', {
      user: 'System',
      text: `${username} has joined the chat`
    });
  });
  
  // Handle chat messages
  socket.on('chatMessage', (message) => {
    io.emit('message', {
      user: socket.username,
      text: message
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('message', {
        user: 'System',
        text: `${socket.username} has left the chat`
      });
    }
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
