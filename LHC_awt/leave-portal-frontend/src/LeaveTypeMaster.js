import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LeaveTypeMaster() {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    yearly_allowed: '',
    monthly_allowed: '',
    with_pay: true
  });
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const fetchLeaveTypes = () => {
    axios.get('http://localhost:5000/leave-types')
      .then(res => {
        console.log('Received leave types:', res.data);
        setLeaveTypes(res.data);
        setError('');
      })
      .catch(err => {
        console.error('Error fetching leave types:', err);
        setError('Failed to load leave types');
      });
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const validateForm = () => {
    // Convert to numbers for comparison
    const yearly = parseInt(form.yearly_allowed);
    const monthly = parseInt(form.monthly_allowed);
    
    if (isNaN(yearly) || yearly <= 0) {
      setError('Yearly allowance must be a positive number');
      return false;
    }
    
    if (isNaN(monthly) || monthly <= 0) {
      setError('Monthly allowance must be a positive number');
      return false;
    }
    
    if (monthly > yearly) {
      setError('Monthly allowance cannot be greater than yearly allowance');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      console.log('Submitting form data:', form);
      if (editMode) {
        console.log('Updating leave type:', editId);
        await axios.put(`http://localhost:5000/leave-types/${editId}`, form);
        setEditMode(false);
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/leave-types', form);
      }
      
      // Reset form and fetch updated list
      setForm({ name: '', yearly_allowed: '', monthly_allowed: '', with_pay: true });
      setError('');
      fetchLeaveTypes();
    } catch (err) {
      console.error('Error saving leave type:', err.response?.data || err);
      setError(err.response?.data?.error || "Error saving leave type");
    }
  };

  const handleEdit = (leaveType) => {
    setForm({
      name: leaveType.name,
      yearly_allowed: leaveType.yearly_allowed,
      monthly_allowed: leaveType.monthly_allowed,
      with_pay: leaveType.with_pay === 1 ? true : Boolean(leaveType.with_pay)
    });
    setEditMode(true);
    setEditId(leaveType.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      try {
        await axios.delete(`http://localhost:5000/leave-types/${id}`);
        fetchLeaveTypes();
      } catch (err) {
        setError(err.response?.data?.error || "Error deleting leave type");
      }
    }
  };

  return (
    <div>
      <h2>Leave Type Master</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Leave Type Name:</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="e.g. Sick Leave, Casual Leave" 
            required 
          />
        </div>
        
        <div>
          <label>Yearly Allowance:</label>
          <input 
            name="yearly_allowed" 
            type="number" 
            min="1"
            value={form.yearly_allowed} 
            onChange={handleChange} 
            placeholder="Total days allowed per year" 
            required 
          />
        </div>
        
        <div>
          <label>Monthly Allowance:</label>
          <input 
            name="monthly_allowed" 
            type="number"
            min="1" 
            value={form.monthly_allowed} 
            onChange={handleChange} 
            placeholder="Maximum days allowed per month" 
            required 
          />
        </div>
        
        <div>
          <label>
            <input 
              name="with_pay" 
              type="checkbox" 
              checked={form.with_pay} 
              onChange={handleChange} 
            />
            With Pay
          </label>
        </div>
        
        <button type="submit">{editMode ? 'Update' : 'Add'} Leave Type</button>
        {editMode && (
          <button type="button" onClick={() => {
            setEditMode(false);
            setEditId(null);
            setForm({ name: '', yearly_allowed: '', monthly_allowed: '', with_pay: true });
          }}>
            Cancel Edit
          </button>
        )}
      </form>
      
      <h3>Existing Leave Types</h3>
      <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Yearly Allowance</th>
            <th>Monthly Allowance</th>
            <th>With Pay</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveTypes.map(leaveType => (
            <tr key={leaveType.id}>
              <td>{leaveType.name}</td>
              <td>{leaveType.yearly_allowed}</td>
              <td>{leaveType.monthly_allowed}</td>
              <td>{leaveType.with_pay ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(leaveType)}>Edit</button>
                <button onClick={() => handleDelete(leaveType.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaveTypeMaster;