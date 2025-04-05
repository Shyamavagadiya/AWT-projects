import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeForm() {
  const [departments, setDepartments] = useState([]);
  const [reportingHeads, setReportingHeads] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department_id: '',
    designation: '',
    reporting_head_id: ''
  });
  const [error, setError] = useState(''); 

  useEffect(() => {
    // Fetch departments
    axios.get('http://localhost:5000/departments')
      .then(res => setDepartments(res.data))
      .catch(err => console.error('Error fetching departments:', err));
    
    // Fetch designations from database
    axios.get('http://localhost:5000/designations')
      .then(res => {
        console.log('Designations data:', res.data);
        if (res.data && res.data.length > 0) {
          setDesignations(res.data);
          setError(''); // Clear any previous error
        } else {
          // Fallback if empty response
          setDesignations([
            { id: 1, position: 'Manager' },
            { id: 2, position: 'Team Leader' },
            { id: 3, position: 'Developer' },
            { id: 4, position: 'Junior Developer' },
            { id: 5, position: 'Intern' }
          ]);
          setError(''); // Clear error when using fallback
        }
      })
      .catch(err => {
        console.error('Error fetching designations:', err);
        // Fallback on error
        setDesignations([
          { id: 1, position: 'Manager' },
          { id: 2, position: 'Team Leader' },
          { id: 3, position: 'Developer' },
          { id: 4, position: 'Junior Developer' },
          { id: 5, position: 'Intern' }
        ]);
        setError(''); // Don't show error when using fallback
      });
  }, []);

  useEffect(() => {
    if (form.department_id) {
      axios.get(`http://localhost:5000/employees/by-department/${form.department_id}`)
        .then(res => setReportingHeads(res.data))
        .catch(err => console.error('Error fetching reporting heads:', err));
    }
  }, [form.department_id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    // Email validation
    if (!form.email.endsWith('@gmail.com')) {
      setError('Email must be a Gmail address (@gmail.com)');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/employees', form);
      alert("Employee Added");
      setForm({ name: '', email: '', department_id: '', designation: '', reporting_head_id: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || "Error adding employee");
    }
  }

  return (
    <div>
      <h2>Add Employee</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required /><br />
        <input 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          placeholder="Email (Gmail only)" 
          pattern="[a-zA-Z0-9._%+-]+@gmail\.com$"
          title="Please enter a valid Gmail address"
          required 
        /><br />
        <select name="department_id" value={form.department_id} onChange={handleChange} required>
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select><br />
        
        <select name="designation" value={form.designation} onChange={handleChange} required>
          <option value="">Select Designation</option>
          {designations.map(desig => (
            <option key={desig.id} value={desig.position}>{desig.position}</option>
          ))}
        </select><br />
        
        <select name="reporting_head_id" value={form.reporting_head_id} onChange={handleChange}>
          <option value="">Select Reporting Head</option>
          {reportingHeads.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} - {emp.designation}</option>
          ))}
        </select><br />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
}

export default EmployeeForm;