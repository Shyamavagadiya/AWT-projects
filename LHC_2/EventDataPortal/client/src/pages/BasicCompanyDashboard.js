import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BasicCompanyDashboard = ({ user, onLogout }) => {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/companies/${user.company}`);
      setCompany(res.data);
    } catch (err) {
      setError('Failed to fetch company details');
    }
  };

  return (
    <div>
      <h2>Company Dashboard</h2>
      <div>
        Logged in as: {user.name} ({user.email}) - Company Admin
        <button onClick={onLogout}>Logout</button>
      </div>
      
      <hr />
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      {!company ? (
        <p>Loading company details...</p>
      ) : !company.isActive ? (
        <div>
          <h3>Account Status: Pending Approval</h3>
          <p>Your company registration is pending approval by the super admin.</p>
        </div>
      ) : (
        <div>
          <h3>Company Information</h3>
          <table border="1">
            <tbody>
              <tr>
                <td>Company Name:</td>
                <td>{company.name}</td>
              </tr>
              <tr>
                <td>Address:</td>
                <td>{company.address}</td>
              </tr>
              <tr>
                <td>Contact Person:</td>
                <td>{company.contactPerson}</td>
              </tr>
              <tr>
                <td>Contact Email:</td>
                <td>{company.contactEmail}</td>
              </tr>
              <tr>
                <td>Contact Phone:</td>
                <td>{company.contactPhone}</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>{company.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            </tbody>
          </table>
          
          <h3>Package Information</h3>
          {!company.activePackage ? (
            <p>No active package. Please contact the super admin to assign a package.</p>
          ) : (
            <table border="1">
              <tbody>
                <tr>
                  <td>Package Name:</td>
                  <td>{company.activePackage.name}</td>
                </tr>
                <tr>
                  <td>Description:</td>
                  <td>{company.activePackage.description}</td>
                </tr>
                <tr>
                  <td>Duration:</td>
                  <td>{company.activePackage.duration} days</td>
                </tr>
                <tr>
                  <td>Event Limit:</td>
                  <td>{company.activePackage.eventLimit}</td>
                </tr>
                <tr>
                  <td>Events Remaining:</td>
                  <td>{company.eventCountRemaining}</td>
                </tr>
                {company.packageExpiryDate && (
                  <tr>
                    <td>Expires On:</td>
                    <td>{new Date(company.packageExpiryDate).toLocaleDateString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default BasicCompanyDashboard;
