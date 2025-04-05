const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Update with your MySQL password
  database: 'task_manager'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Create tasks table if it doesn't exist
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('pending', 'completed') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating tasks table:', err);
    } else {
      console.log('Tasks table created or already exists');
    }
  });
});

// Routes
// Home page - display all tasks
app.get('/', (req, res) => {
  connection.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error('Error fetching tasks:', err);
      return res.status(500).send('Error fetching tasks');
    }
    res.render('index', { tasks: results });
  });
});

// Add new task form
app.get('/add', (req, res) => {
  res.render('add');
});

// Create new task
app.post('/add', (req, res) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).send('Title is required');
  }
  
  const task = {
    title,
    description: description || ''
  };
  
  connection.query('INSERT INTO tasks SET ?', task, (err) => {
    if (err) {
      console.error('Error adding task:', err);
      return res.status(500).send('Error adding task');
    }
    res.redirect('/');
  });
});

// Edit task form
app.get('/edit/:id', (req, res) => {
  const taskId = req.params.id;
  
  connection.query('SELECT * FROM tasks WHERE id = ?', [taskId], (err, results) => {
    if (err || results.length === 0) {
      console.error('Error fetching task:', err);
      return res.status(404).send('Task not found');
    }
    res.render('edit', { task: results[0] });
  });
});

// Update task
app.post('/edit/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, description, status } = req.body;
  
  if (!title) {
    return res.status(400).send('Title is required');
  }
  
  const task = {
    title,
    description: description || '',
    status: status || 'pending'
  };
  
  connection.query('UPDATE tasks SET ? WHERE id = ?', [task, taskId], (err) => {
    if (err) {
      console.error('Error updating task:', err);
      return res.status(500).send('Error updating task');
    }
    res.redirect('/');
  });
});

// Delete task
app.get('/delete/:id', (req, res) => {
  const taskId = req.params.id;
  
  connection.query('DELETE FROM tasks WHERE id = ?', [taskId], (err) => {
    if (err) {
      console.error('Error deleting task:', err);
      return res.status(500).send('Error deleting task');
    }
    res.redirect('/');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});