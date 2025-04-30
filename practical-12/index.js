// First, install MongoDB dependencies
// npm install mongoose

// Update your index.js file to include MongoDB integration:
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configure express to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Define Message Schema
const messageSchema = new mongoose.Schema({
  user: String,
  text: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create Message model
const Message = mongoose.model('Message', messageSchema);

// Define User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Create User model
const User = mongoose.model('User', userSchema);

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// CRUD API ROUTES FOR MESSAGES

// CREATE - Post a new message
app.post('/api/messages', async (req, res) => {
  try {
    const { user, text } = req.body;
    
    if (!user || !text) {
      return res.status(400).json({ error: 'User and text are required' });
    }
    
    const message = new Message({ user, text });
    const savedMessage = await message.save();
    
    // Broadcast new message to all clients
    io.emit('message', savedMessage);
    
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get message by ID
app.get('/api/messages/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update a message
app.put('/api/messages/:id', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { text, $set: { timestamp: Date.now() } },
      { new: true }
    );
    
    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Broadcast updated message
    io.emit('messageUpdated', updatedMessage);
    
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    
    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Broadcast message deletion
    io.emit('messageDeleted', { id: req.params.id });
    
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CRUD API ROUTES FOR USERS

// CREATE - Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }
    
    const user = new User({ username });
    const savedUser = await user.save();
    
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ joinedAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ - Get user by username
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE - Update user's last active timestamp
app.put('/api/users/:username', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: req.params.username },
      { lastActive: Date.now() },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a user
app.delete('/api/users/:username', async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ username: req.params.username });
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Handle user joining with a username
  socket.on('join', async (username) => {
    socket.username = username;
    
    // Create or update user in database
    try {
      const existingUser = await User.findOne({ username });
      
      if (existingUser) {
        await User.findOneAndUpdate(
          { username },
          { lastActive: Date.now() }
        );
      } else {
        const newUser = new User({ username });
        await newUser.save();
      }
      
      // Send system message
      const systemMessage = new Message({
        user: 'System',
        text: `${username} has joined the chat`
      });
      await systemMessage.save();
      
      io.emit('message', systemMessage);
      
      // Send chat history to new user
      const messageHistory = await Message.find().sort({ timestamp: 1 }).limit(50);
      socket.emit('messageHistory', messageHistory);
      
    } catch (error) {
      console.error('Database error:', error);
    }
  });
  
  // Handle chat messages
  socket.on('chatMessage', async (message) => {
    try {
      if (socket.username) {
        const newMessage = new Message({
          user: socket.username,
          text: message
        });
        
        const savedMessage = await newMessage.save();
        io.emit('message', savedMessage);
        
        // Update user's last active timestamp
        await User.findOneAndUpdate(
          { username: socket.username },
          { lastActive: Date.now() }
        );
      }
    } catch (error) {
      console.error('Database error:', error);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', async () => {
    if (socket.username) {
      try {
        // Send system message
        const systemMessage = new Message({
          user: 'System',
          text: `${socket.username} has left the chat`
        });
        await systemMessage.save();
        
        io.emit('message', systemMessage);
        
        // Update user's last active timestamp
        await User.findOneAndUpdate(
          { username: socket.username },
          { lastActive: Date.now() }
        );
      } catch (error) {
        console.error('Database error:', error);
      }
    }
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});