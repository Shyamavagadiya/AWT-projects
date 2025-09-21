import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Alert, Table } from 'react-bootstrap';
import axios from 'axios';

const SimpleDashboard = () => {
  // Package state
  const [packages, setPackages] = useState([]);
  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [eventLimit, setEventLimit] = useState('');
  
  // Company registration state
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // Company approvals state
  const [pendingCompanies, setPendingCompanies] = useState([]);
  
  // UI state
  const [packageError, setPackageError] = useState('');
  const [packageSuccess, setPackageSuccess] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [companySuccess, setCompanySuccess] = useState('');
  const [approvalError, setApprovalError] = useState('');
  const [approvalSuccess, setApprovalSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    
    // Basic validation
    if (!packageName || !description || !price || !duration || !eventLimit) {
      setPackageError('Please fill in all package fields');
      return;
    }
    
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (err) {
      setPackageError(err.response?.data?.message || 'Failed to create package');
      setLoading(false);
    }
  };

  // Handle company registration
  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setCompanyError('');
    setCompanySuccess('');
    
    // Basic validation
    if (!companyName || !companyAddress || !contactPerson || !contactEmail || !contactPhone ||
        !adminName || !adminEmail || !adminPassword) {
      setCompanyError('Please fill in all company and admin fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Register company with admin
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
      
      setCompanySuccess('Company registered successfully. Pending approval.');
      
      // Reset form
      setCompanyName('');
      setCompanyAddress('');
      setContactPerson('');
      setContactEmail('');
      setContactPhone('');
      setAdminName('');
      setAdminEmail('');
      setAdminPassword('');
      
      fetchPendingCompanies();
      setLoading(false);
    } catch (err) {
      setCompanyError(err.response?.data?.message || 'Failed to register company');
      setLoading(false);
    }
  };

  // Handle company approval
  const handleApprove = async (id) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/companies/${id}/approve`, {});
      
      setApprovalSuccess('Company approved successfully');
      fetchPendingCompanies();
      setLoading(false);
    } catch (err) {
      setApprovalError('Failed to approve company');
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1>Event Data Portal</h1>
        <div className="alert alert-info">
          Signed in as: <strong>Super Admin</strong>
        </div>
      </div>
      
      {/* Package Creation Section */}
      <Card className="mb-4">
        <Card.Header>
          <h3>Create Package</h3>
        </Card.Header>
        <Card.Body>
          {packageError && <Alert variant="danger">{packageError}</Alert>}
          {packageSuccess && <Alert variant="success">{packageSuccess}</Alert>}
          
          <Row>
            <Col md={6}>
              <Form onSubmit={handlePackageSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Package Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="Enter package name"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                  />
                </Form.Group>
                
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Price ($)</Form.Label>
                      <Form.Control
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Enter price"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Duration (days)</Form.Label>
                      <Form.Control
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Enter days"
                        min="1"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Event Limit</Form.Label>
                  <Form.Control
                    type="number"
                    value={eventLimit}
                    onChange={(e) => setEventLimit(e.target.value)}
                    placeholder="Enter event limit"
                    min="1"
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Package'}
                </Button>
              </Form>
            </Col>
            
            <Col md={6}>
              <h5>Existing Packages</h5>
              {packages.length === 0 ? (
                <p>No packages found</p>
              ) : (
                <Table striped bordered hover>
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
                </Table>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Company Registration Section */}
      <Card className="mb-4">
        <Card.Header>
          <h3>Register Company</h3>
        </Card.Header>
        <Card.Body>
          {companyError && <Alert variant="danger">{companyError}</Alert>}
          {companySuccess && <Alert variant="success">{companySuccess}</Alert>}
          
          <Form onSubmit={handleCompanySubmit}>
            <Row>
              <Col md={6}>
                <h5>Company Details</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Company Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Enter company address"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Enter contact person name"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Enter contact email"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Enter contact phone"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <h5>Admin Account</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Admin Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Enter admin name"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Admin Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter admin email"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Admin Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Company'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      {/* Company Approvals Section */}
      <Card>
        <Card.Header>
          <h3>Company Approvals</h3>
        </Card.Header>
        <Card.Body>
          {approvalError && <Alert variant="danger">{approvalError}</Alert>}
          {approvalSuccess && <Alert variant="success">{approvalSuccess}</Alert>}
          
          {pendingCompanies.length === 0 ? (
            <p>No pending company approvals</p>
          ) : (
            <Table striped bordered hover>
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
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleApprove(company._id)}
                        disabled={loading}
                      >
                        Approve
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SimpleDashboard;
