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

// Leave Requests endpoints
app.post('/leave-requests', (req, res) => {
  const { employee_id, leave_type_id, start_date, end_date, reason, with_pay } = req.body;
  
  // Calculate number of days
  const start = new Date(start_date);
  const end = new Date(end_date);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end days
  
  // Validate dates
  if (start > end) {
    return res.status(400).json({ error: 'End date must be after start date' });
  }
  
  // Check if employee has enough leave balance
  connection.query(
    `SELECT lt.yearly_allowed, lt.monthly_allowed, 
     (SELECT COUNT(*) FROM leave_requests lr 
      WHERE lr.employee_id = ? AND lr.leave_type_id = ? AND lr.status = 'approved' 
      AND YEAR(lr.start_date) = YEAR(CURDATE())) as used_yearly,
     (SELECT COUNT(*) FROM leave_requests lr 
      WHERE lr.employee_id = ? AND lr.leave_type_id = ? AND lr.status = 'approved' 
      AND MONTH(lr.start_date) = MONTH(CURDATE()) AND YEAR(lr.start_date) = YEAR(CURDATE())) as used_monthly
    FROM leave_types lt WHERE lt.id = ?`,
    [employee_id, leave_type_id, employee_id, leave_type_id, leave_type_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'Leave type not found' });
      }
      
      const { yearly_allowed, monthly_allowed, used_yearly, used_monthly } = results[0];
      
      if (used_yearly + diffDays > yearly_allowed) {
        return res.status(400).json({ 
          error: `Not enough yearly leave balance. Available: ${yearly_allowed - used_yearly}, Requested: ${diffDays}` 
        });
      }
      
      if (used_monthly + diffDays > monthly_allowed) {
        return res.status(400).json({ 
          error: `Not enough monthly leave balance. Available: ${monthly_allowed - used_monthly}, Requested: ${diffDays}` 
        });
      }
      
      // Insert leave request
      connection.query(
        'INSERT INTO leave_requests (employee_id, leave_type_id, start_date, end_date, reason, with_pay) VALUES (?, ?, ?, ?, ?, ?)',
        [employee_id, leave_type_id, start_date, end_date, reason, with_pay],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to create leave request: ' + err.message });
          }
          
          res.status(201).json({
            message: 'Leave request submitted successfully',
            id: result.insertId
          });
        }
      );
    }
  );
});

// Get all leave requests (for admin/head)
app.get('/leave-requests', (req, res) => {
  connection.query(
    `SELECT lr.*, e.name as employee_name, lt.name as leave_type_name 
     FROM leave_requests lr
     JOIN employees e ON lr.employee_id = e.id
     JOIN leave_types lt ON lr.leave_type_id = lt.id
     ORDER BY lr.created_at DESC`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch leave requests: ' + err.message });
      }
      
      res.json(results);
    }
  );
});

// Get leave requests for a specific employee
app.get('/leave-requests/employee/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  
  connection.query(
    `SELECT lr.*, lt.name as leave_type_name 
     FROM leave_requests lr
     JOIN leave_types lt ON lr.leave_type_id = lt.id
     WHERE lr.employee_id = ?
     ORDER BY lr.created_at DESC`,
    [employeeId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch leave requests: ' + err.message });
      }
      
      res.json(results);
    }
  );
});

// Get leave requests for employees under a specific head
app.get('/leave-requests/head/:headId', (req, res) => {
  const { headId } = req.params;
  
  connection.query(
    `SELECT lr.*, e.name as employee_name, lt.name as leave_type_name 
     FROM leave_requests lr
     JOIN employees e ON lr.employee_id = e.id
     JOIN leave_types lt ON lr.leave_type_id = lt.id
     WHERE e.reporting_head_id = ?
     ORDER BY lr.created_at DESC`,
    [headId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch leave requests: ' + err.message });
      }
      
      res.json(results);
    }
  );
});

// Approve or reject leave request
app.put('/leave-requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, with_pay } = req.body;
  
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be either approved or rejected' });
  }
  
  connection.query(
    'UPDATE leave_requests SET status = ?, with_pay = ? WHERE id = ?',
    [status, with_pay, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update leave request: ' + err.message });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Leave request not found' });
      }
      
      res.json({ message: `Leave request ${status}` });
    }
  );
});

// Get leave statistics for dashboard
app.get('/leave-statistics/:employeeId', (req, res) => {
  const { employeeId } = req.params;
  
  connection.query(
    `SELECT 
      lt.id, lt.name, lt.yearly_allowed, lt.monthly_allowed,
      (SELECT COUNT(*) FROM leave_requests lr 
       WHERE lr.employee_id = ? AND lr.leave_type_id = lt.id AND lr.status = 'approved' 
       AND YEAR(lr.start_date) = YEAR(CURDATE())) as used_yearly,
      (SELECT COUNT(*) FROM leave_requests lr 
       WHERE lr.employee_id = ? AND lr.leave_type_id = lt.id AND lr.status = 'approved' 
       AND MONTH(lr.start_date) = MONTH(CURDATE()) AND YEAR(lr.start_date) = YEAR(CURDATE())) as used_monthly,
      (SELECT COUNT(*) FROM leave_requests lr 
       WHERE lr.employee_id = ? AND lr.leave_type_id = lt.id AND lr.status = 'pending') as pending_count
     FROM leave_types lt`,
    [employeeId, employeeId, employeeId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch leave statistics: ' + err.message });
      }
      
      res.json(results);
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
