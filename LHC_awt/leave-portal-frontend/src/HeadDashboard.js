import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HeadDashboard({ headId }) {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchEmployees();
    fetchLeaveRequests();
  }, [headId]);
  
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/employees/by-head/${headId}`);
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees');
    }
  };
  
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/leave-requests/head/${headId}`);
      setLeaveRequests(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError('Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (id, status, withPay) => {
    try {
      await axios.put(`http://localhost:5000/leave-requests/${id}/status`, {
        status,
        with_pay: withPay
      });
      
      // Refresh the list
      fetchLeaveRequests();
    } catch (err) {
      console.error('Error updating leave request:', err);
      setError('Failed to update leave request');
    }
  };

  // Filter requests based on selected employee
  const filteredRequests = selectedEmployee === 'all' 
    ? leaveRequests 
    : leaveRequests.filter(req => req.employee_id.toString() === selectedEmployee);

  // Calculate summary statistics
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  // Create summary data
  const summaryData = filteredRequests.reduce((acc, request) => {
    const leaveTypeId = request.leave_type_id;
    if (!acc[leaveTypeId]) {
      acc[leaveTypeId] = {
        name: request.leave_type_name,
        total: 0,
        yearlyTaken: 0,
        monthlyTaken: 0
      };
    }
    
    acc[leaveTypeId].total++;
    
    if (request.status === 'approved') {
      const startDate = new Date(request.start_date);
      if (startDate.getFullYear() === currentYear) {
        acc[leaveTypeId].yearlyTaken++;
        if (startDate.getMonth() + 1 === currentMonth) {
          acc[leaveTypeId].monthlyTaken++;
        }
      }
    }
    
    return acc;
  }, {});
  
  return (
    <div>
      <h2>Department Head Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="employee-select">Select Employee: </label>
        <select 
          id="employee-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="all">All Employees</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Leave Summary</h3>
          <table border="1" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Total Requests</th>
                <th>Taken This Year</th>
                <th>Taken This Month</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(summaryData).map((data, index) => (
                <tr key={index}>
                  <td>{data.name}</td>
                  <td>{data.total}</td>
                  <td>{data.yearlyTaken}</td>
                  <td>{data.monthlyTaken}</td>
                </tr>
              ))}
              {Object.values(summaryData).length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>
          
          <h3>Leave Requests</h3>
          <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Status</th>
                <th>With Pay</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.employee_name}</td>
                    <td>{request.leave_type_name}</td>
                    <td>
                      {new Date(request.start_date).toLocaleDateString()} - 
                      {new Date(request.end_date).toLocaleDateString()}
                    </td>
                    <td>{request.status}</td>
                    <td>
                      {request.status === 'pending' ? (
                        <select 
                          defaultValue={request.with_pay ? 'true' : 'false'}
                          onChange={(e) => {
                            const updatedRequests = leaveRequests.map(r => 
                              r.id === request.id ? {...r, with_pay: e.target.value === 'true'} : r
                            );
                            setLeaveRequests(updatedRequests);
                          }}
                        >
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      ) : (
                        request.with_pay ? 'Yes' : 'No'
                      )}
                    </td>
                    <td>
                      {request.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(
                              request.id, 
                              'approved', 
                              leaveRequests.find(r => r.id === request.id).with_pay
                            )}
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusChange(
                              request.id, 
                              'rejected', 
                              leaveRequests.find(r => r.id === request.id).with_pay
                            )}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No leave requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HeadDashboard;