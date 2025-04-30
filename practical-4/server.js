const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'student_db'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
    
    // Create table if not exists
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            course VARCHAR(100) NOT NULL
        )
    `;
    
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Students table created or already exists');
        }
    });
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all students
app.get('/api/students', (req, res) => {
    const query = 'SELECT * FROM students';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).json({ error: 'Error fetching students' });
        }
        res.json(results);
    });
});

// Add a new student
app.post('/api/students', (req, res) => {
    const { name, email, course } = req.body;
    
    if (!name || !email || !course) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const query = 'INSERT INTO students (name, email, course) VALUES (?, ?, ?)';
    
    db.query(query, [name, email, course], (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            return res.status(500).json({ error: 'Error adding student' });
        }
        res.redirect('/');
    });
});

// Delete a student
app.get('/api/students/delete/:id', (req, res) => {
    const id = req.params.id;
    
    const query = 'DELETE FROM students WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting student:', err);
            return res.status(500).json({ error: 'Error deleting student' });
        }
        res.redirect('/');
    });
});

// Update a student
app.post('/api/students/update', (req, res) => {
    const { id, name, email, course } = req.body;
    
    if (!id || !name || !email || !course) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const query = 'UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?';
    
    db.query(query, [name, email, course, id], (err, result) => {
        if (err) {
            console.error('Error updating student:', err);
            return res.status(500).json({ error: 'Error updating student' });
        }
        res.redirect('/');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});