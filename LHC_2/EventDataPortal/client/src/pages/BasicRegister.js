import React, { useState } from 'react';
import axios from 'axios';

const BasicRegister = () => {
  // Company details
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  // Admin details
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register-company', {
        company: {
          name: companyName,
          address: companyAddress,
          contactPerson,
          contactEmail,
          contactPhone
        },
        admin: {
          name: adminName,
          email: adminEmail,
          password: adminPassword
        }
      });
      
      setSuccess('Registration successful! Your account is pending approval by the super admin.');
      // Clear form
      setCompanyName('');
      setCompanyAddress('');
      setContactPerson('');
      setContactEmail('');
      setContactPhone('');
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div>
      <h2>Company Registration</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <h3>Company Details</h3>
        <div>
          <label>Company Name:</label>
          <input 
            type="text" 
            value={companyName} 
            onChange={(e) => setCompanyName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Company Address:</label>
          <textarea 
            value={companyAddress} 
            onChange={(e) => setCompanyAddress(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Contact Person:</label>
          <input 
            type="text" 
            value={contactPerson} 
            onChange={(e) => setContactPerson(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Contact Email:</label>
          <input 
            type="email" 
            value={contactEmail} 
            onChange={(e) => setContactEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Contact Phone:</label>
          <input 
            type="tel" 
            value={contactPhone} 
            onChange={(e) => setContactPhone(e.target.value)} 
            required 
          />
        </div>
        
        <h3>Admin Account</h3>
        <div>
          <label>Admin Name:</label>
          <input 
            type="text" 
            value={adminName} 
            onChange={(e) => setAdminName(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Admin Email:</label>
          <input 
            type="email" 
            value={adminEmail} 
            onChange={(e) => setAdminEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Admin Password:</label>
          <input 
            type="password" 
            value={adminPassword} 
            onChange={(e) => setAdminPassword(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit">Register Company</button>
      </form>
      
      <div>
        <a href="/">Back to Login</a>
      </div>
    </div>
  );
};

export default BasicRegister;
