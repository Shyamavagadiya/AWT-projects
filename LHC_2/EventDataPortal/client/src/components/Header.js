import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Event Data Portal</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {user ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                {user.role === 'superadmin' && (
                  <>
                    <Nav.Link as={Link} to="/packages">Packages</Nav.Link>
                    <Nav.Link as={Link} to="/approvals">Company Approvals</Nav.Link>
                  </>
                )}
                <Nav.Link as={Link} to="/events">Events</Nav.Link>
                {(user.role === 'superadmin' || user.role === 'admin') && (
                  <Nav.Link as={Link} to="/users">Users</Nav.Link>
                )}
              </Nav>
              <Nav>
                <Navbar.Text className="me-3">
                  Signed in as: <span className="text-light">{user.name}</span> ({user.role})
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
