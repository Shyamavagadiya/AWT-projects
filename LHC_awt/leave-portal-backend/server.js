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

// Leave Types endpoints
app.get('/leave-types', (req, res) => {
  connection.query('SELECT * FROM leave_types', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch leave types' });
    }
    res.json(results);
  });
});

app.post('/leave-types', (req, res) => {
  const { name, yearly_allowed, monthly_allowed, with_pay } = req.body;
  
  // Validate monthly <= yearly
  if (parseInt(monthly_allowed) > parseInt(yearly_allowed)) {
    return res.status(400).json({ error: 'Monthly allowance cannot exceed yearly allowance' });
  }
  
  const query = 'INSERT INTO leave_types (name, yearly_allowed, monthly_allowed, with_pay) VALUES (?, ?, ?, ?)';
  const values = [name, yearly_allowed, monthly_allowed, with_pay];
  
  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create leave type: ' + err.message });
    }
    
    res.status(201).json({ 
      message: 'Leave type added successfully',
      id: result.insertId
    });
  });
});

app.put('/leave-types/:id', (req, res) => {
  const { id } = req.params;
  const { name, yearly_allowed, monthly_allowed, with_pay } = req.body;
  
  // Validate monthly <= yearly
  if (parseInt(monthly_allowed) > parseInt(yearly_allowed)) {
    return res.status(400).json({ error: 'Monthly allowance cannot exceed yearly allowance' });
  }
  
  const query = 'UPDATE leave_types SET name = ?, yearly_allowed = ?, monthly_allowed = ?, with_pay = ? WHERE id = ?';
  const values = [name, yearly_allowed, monthly_allowed, with_pay, id];
  
  connection.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update leave type: ' + err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leave type not found' });
    }
    
    res.json({ message: 'Leave type updated successfully' });
  });
});

app.delete('/leave-types/:id', (req, res) => {
  const { id } = req.params;
  
  connection.query('DELETE FROM leave_types WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error deleting leave type:', err);
      return res.status(500).json({ error: 'Failed to delete leave type' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Leave type not found' });
    }
    
    res.json({ message: 'Leave type deleted successfully' });
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
