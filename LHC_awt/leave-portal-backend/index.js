const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Fetch all departments
app.get('/departments', (req, res) => {
  db.query('SELECT * FROM departments', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Fetch employees by department (for reporting head dropdown)
app.get('/employees/by-department/:deptId', (req, res) => {
  const deptId = req.params.deptId;
  db.query('SELECT * FROM employees WHERE department_id = ?', [deptId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add new employee
app.post('/employees', (req, res) => {
  const { name, email, department_id, designation, reporting_head_id } = req.body;

  // Validate that reporting head is from same department
  db.query(
    'SELECT * FROM employees WHERE id = ? AND department_id = ?',
    [reporting_head_id, department_id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0 && reporting_head_id != null) {
        return res.status(400).json({ error: 'Reporting head must be from the same department' });
      }

      // Insert employee
      db.query(
        'INSERT INTO employees (name, email, department_id, designation, reporting_head_id) VALUES (?, ?, ?, ?, ?)',
        [name, email, department_id, designation, reporting_head_id],
        (err, result) => {
          if (err) return res.status(500).send(err);
          res.json({ message: 'Employee added successfully' });
        }
      );
    }
  );
});

app.listen(5000, () => {
  console.log('Server started on port 5000');
});
