import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Packages = () => {
  // Package state
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [eventLimit, setEventLimit] = useState('');

  const { user } = useAuth();

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/packages', {
        withCredentials: true
      });
      setPackages(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch packages');
      setLoading(false);
    }
  };

  // Handle form submission for creating a new package
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!name || !description || !price || !duration || !eventLimit) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const packageData = {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration),
        eventLimit: parseInt(eventLimit)
      };
      
      await axios.post('http://localhost:5000/api/packages', packageData, {
        withCredentials: true
      });
      
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setDuration('');
      setEventLimit('');
      
      setSuccess('Package created successfully');
      fetchPackages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create package');
    }
  };

  // Check if user is super admin
  if (user && user.role !== 'superadmin') {
    return (
      <Alert variant="danger">
        You do not have permission to access this page.
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Manage Packages</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Create New Package</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Package Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter package name"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter package description"
                    required
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
                        required
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
                        required
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
                    required
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit">
                  Create Package
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>Available Packages</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : packages.length === 0 ? (
                <p className="text-center">No packages found</p>
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
            </Card.Body>
          </Card>
          
          <div className="mt-4">
            <Card>
              <Card.Header>How to Test Package Creation</Card.Header>
              <Card.Body>
                <ol>
                  <li>Login as a super admin (use the credentials you created)</li>
                  <li>Fill in the package details on the left form</li>
                  <li>Click "Create Package" button</li>
                  <li>The new package will appear in the table above</li>
                </ol>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Packages;
