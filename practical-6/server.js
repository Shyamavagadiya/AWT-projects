const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Import routes
const studentRoutes = require('./routes/students');

// Use routes
app.use('/api/students', studentRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to Student API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});