import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BasicSuperAdminDashboard = ({ user, onLogout }) => {
  // Package state
  const [packages, setPackages] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [eventLimit, setEventLimit] = useState('');
  
  // Company approvals state
  const [pendingCompanies, setPendingCompanies] = useState([]);
  
  // UI state
  const [packageError, setPackageError] = useState('');
  const [packageSuccess, setPackageSuccess] = useState('');
  const [approvalError, setApprovalError] = useState('');
  const [approvalSuccess, setApprovalSuccess] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchPackages();
    fetchPendingCompanies();
  }, []);

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/packages');
      setPackages(res.data);
    } catch (err) {
      setPackageError('Failed to fetch packages');
    }
  };

  // Fetch pending companies
  const fetchPendingCompanies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/companies');
      const pending = res.data.filter(company => !company.isActive);
      setPendingCompanies(pending);
    } catch (err) {
      setApprovalError('Failed to fetch pending companies');
    }
  };

  // Handle package creation
  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setPackageError('');
    setPackageSuccess('');
    
    try {
      const packageData = {
        name: packageName,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        eventLimit: parseInt(eventLimit)
      };
      
      await axios.post('http://localhost:5000/api/packages', packageData);
      
      // Reset form
      setPackageName('');
      setDescription('');
      setPrice('');
      setDuration('');
      setEventLimit('');
      
      setPackageSuccess('Package created successfully');
      fetchPackages();
    } catch (err) {
      setPackageError('Failed to create package');
    }
  };

  // Handle company approval
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/companies/${id}/approve`, {});
      
      setApprovalSuccess('Company approved successfully');
      fetchPendingCompanies();
    } catch (err) {
      setApprovalError('Failed to approve company');
    }
  };

  return (
    <div>
      <h2>Super Admin Dashboard</h2>
      <div>
        Logged in as: {user.name} ({user.email}) - Super Admin
        <button onClick={onLogout}>Logout</button>
      </div>
      
      <hr />
      
      {/* Package Creation Section */}
      <div>
        <h3>Create Package</h3>
        {packageError && <div style={{ color: 'red' }}>{packageError}</div>}
        {packageSuccess && <div style={{ color: 'green' }}>{packageSuccess}</div>}
        
        <form onSubmit={handlePackageSubmit}>
          <div>
            <label>Package Name:</label>
            <input 
              type="text" 
              value={packageName} 
              onChange={(e) => setPackageName(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Price ($):</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              min="0" 
              required 
            />
          </div>
          <div>
            <label>Duration (days):</label>
            <input 
              type="number" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)} 
              min="1" 
              required 
            />
          </div>
          <div>
            <label>Event Limit:</label>
            <input 
              type="number" 
              value={eventLimit} 
              onChange={(e) => setEventLimit(e.target.value)} 
              min="1" 
              required 
            />
          </div>
          <button type="submit">Create Package</button>
        </form>
      </div>
      
      <div>
        <h3>Existing Packages</h3>
        {packages.length === 0 ? (
          <p>No packages found</p>
        ) : (
          <table border="1">
            <thead>
              <tr>
                <th>Name</th>
                <th>Duration</th>
                <th>Event Limit</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg._id}>
                  <td>{pkg.name}</td>
                  <td>{pkg.duration} days</td>
                  <td>{pkg.eventLimit} events</td>
                  <td>${pkg.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <hr />
      
      {/* Company Approvals Section */}
      <div>
        <h3>Company Approvals</h3>
        {approvalError && <div style={{ color: 'red' }}>{approvalError}</div>}
        {approvalSuccess && <div style={{ color: 'green' }}>{approvalSuccess}</div>}
        
        {pendingCompanies.length === 0 ? (
          <p>No pending company approvals</p>
        ) : (
          <table border="1">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Contact Person</th>
                <th>Contact Email</th>
                <th>Contact Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingCompanies.map(company => (
                <tr key={company._id}>
                  <td>{company.name}</td>
                  <td>{company.contactPerson}</td>
                  <td>{company.contactEmail}</td>
                  <td>{company.contactPhone}</td>
                  <td>
                    <button onClick={() => handleApprove(company._id)}>
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BasicSuperAdminDashboard;
