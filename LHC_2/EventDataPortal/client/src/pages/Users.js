import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Row, Col, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  // Users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('dataentry');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { user } = useAuth();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users based on user role
  const fetchUsers = async () => {
    try {
      setLoading(true);
      let res;
      
      if (user.role === 'superadmin') {
        // Super admin can see all users
        res = await axios.get('http://localhost:5000/api/users', {
          withCredentials: true
        });
      } else if (user.role === 'admin') {
        // Company admin can only see users from their company
        res = await axios.get(`http://localhost:5000/api/users/company/${user.company}`, {
          withCredentials: true
        });
      }
      
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  // Handle form submission for creating a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!name || !email || !password || !role) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const userData = {
        name,
        email,
        password,
        role,
        company: user.company
      };
      
      await axios.post('http://localhost:5000/api/users', userData, {
        withCredentials: true
      });
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setRole('dataentry');
      
      setSuccess('User created successfully');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        withCredentials: true
      });
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  // Open edit modal
  const openEditModal = (userData) => {
    setCurrentUser(userData);
    setName(userData.name);
    setEmail(userData.email);
    setPassword(''); // Don't set password for editing
    setRole(userData.role);
    setShowModal(true);
  };

  // Handle user update
  const handleUpdate = async () => {
    try {
      const userData = {
        name,
        email,
        role
      };
      
      // Only include password if it's provided
      if (password) {
        userData.password = password;
      }
      
      await axios.put(`http://localhost:5000/api/users/${currentUser._id}`, userData, {
        withCredentials: true
      });
      
      setSuccess('User updated successfully');
      setShowModal(false);
      fetchUsers();
      
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setRole('dataentry');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  // Check if user has permission to access this page
  if (user && user.role !== 'superadmin' && user.role !== 'admin') {
    return (
      <Alert variant="danger">
        You do not have permission to access this page.
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Manage Users</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Create New User</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter user name"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter user email"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="dataentry">Data Entry Operator</option>
                    {user.role === 'superadmin' && (
                      <>
                        <option value="admin">Company Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <option value="admin">Company Admin</option>
                    )}
                  </Form.Select>
                </Form.Group>
                
                <Button variant="primary" type="submit">
                  Create User
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>User List</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <p className="text-center">No users found</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(userData => (
                      <tr key={userData._id}>
                        <td>{userData.name}</td>
                        <td>{userData.email}</td>
                        <td>
                          {userData.role === 'superadmin' ? 'Super Admin' : 
                           userData.role === 'admin' ? 'Company Admin' : 
                           'Data Entry Operator'}
                        </td>
                        <td>
                          <Button 
                            variant="info" 
                            size="sm" 
                            className="me-2"
                            onClick={() => openEditModal(userData)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDelete(userData._id)}
                            disabled={userData.role === 'superadmin'}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password (leave blank to keep current)</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                disabled={currentUser?.role === 'superadmin' && user.role !== 'superadmin'}
              >
                <option value="dataentry">Data Entry Operator</option>
                {user.role === 'superadmin' && (
                  <>
                    <option value="admin">Company Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </>
                )}
                {user.role === 'admin' && (
                  <option value="admin">Company Admin</option>
                )}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
