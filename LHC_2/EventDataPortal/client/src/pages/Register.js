import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
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
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!companyName || !companyAddress || !contactPerson || !contactEmail || !contactPhone ||
        !adminName || !adminEmail || !adminPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (adminPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      
      // Register company with admin
      const response = await axios.post('http://localhost:5000/api/auth/register-company', {
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
      setLoading(false);
      
      // Clear form
      setCompanyName('');
      setCompanyAddress('');
      setContactPerson('');
      setContactEmail('');
      setContactPhone('');
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Card className="p-4 my-5" style={{ maxWidth: '800px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Company Registration</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <h4 className="mb-3">Company Details</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Enter contact person name"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Company Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Enter company address"
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Enter contact email"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Enter contact phone"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <hr className="my-3" />
            
            <h4 className="mb-3">Admin Account</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Admin Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Enter admin name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Admin Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter admin email"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-3" 
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register Company'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
          
          <Card className="mt-4">
            <Card.Header>How to Test Company Registration</Card.Header>
            <Card.Body>
              <ol>
                <li>Fill in all the company details and admin account information above</li>
                <li>Click "Register Company" button</li>
                <li>You'll see a success message that your account is pending approval</li>
                <li>Super admin needs to approve your company registration</li>
                <li>After approval, you can login with your admin email and password</li>
              </ol>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
