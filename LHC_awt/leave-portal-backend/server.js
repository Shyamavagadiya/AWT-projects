const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all departments
app.get('/departments', (req, res) => {
  connection.query('SELECT * FROM departments', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get designations from database
app.get('/designations', (req, res) => {
  connection.query('SELECT * FROM designations', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Initialize department heads as reporting heads
app.post('/init-reporting-heads', (req, res) => {
  connection.query('SELECT * FROM employees WHERE reporting_head_id IS NULL', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      return res.json({ message: 'Reporting heads already exist' });
    }

    connection.query('SELECT id FROM departments', (err, departments) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const departmentHeads = departments.map((dept, index) => {
        return [
          `Department Head ${index + 1}`, // name
          `head${index + 1}@company.com`, // email
          dept.id,                        // department_id
          'Department Head',              // designation
          null                            // reporting_head_id
        ];
      });

      connection.query(
        'INSERT INTO employees (name, email, department_id, designation, reporting_head_id) VALUES ?',
        [departmentHeads],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.status(201).json({
            message: `${result.affectedRows} department heads added successfully`
          });
        }
      );
    });
  });
});

// Get all employees
app.get('/employees', (req, res) => {
  connection.query('SELECT * FROM employees', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get employees by department ID (for reporting head dropdown)
app.get('/employees/by-department/:departmentId', (req, res) => {
  const departmentId = req.params.departmentId;

  connection.query(
    'SELECT id, name, designation FROM employees WHERE department_id = ?',
    [departmentId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
    }
  );
});

// Add new employee with validation
app.post('/employees', (req, res) => {
  const { name, email, department_id, designation, reporting_head_id } = req.body;

  function insertEmployee() {
    connection.query(
      'INSERT INTO employees (name, email, department_id, designation, reporting_head_id) VALUES (?, ?, ?, ?, ?)',
      [name, email, department_id, designation, reporting_head_id || null],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, message: 'Employee added successfully' });
      }
    );
  }

  if (reporting_head_id) {
    connection.query(
      'SELECT department_id FROM employees WHERE id = ?',
      [reporting_head_id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: 'Reporting head not found' });
        }

        if (results[0].department_id != department_id) {
          return res.status(400).json({ error: 'Reporting head must be from the same department' });
        }

        insertEmployee();
      }
    );
  } else {
    insertEmployee();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
