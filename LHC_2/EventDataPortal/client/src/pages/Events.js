import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Form, Row, Col, Alert, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Events = () => {
  // Events state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  const { user } = useAuth();

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events based on user role
  const fetchEvents = async () => {
    try {
      setLoading(true);
      let res;
      
      if (user.role === 'superadmin') {
        // Super admin can see all events
        res = await axios.get('http://localhost:5000/api/events', {
          withCredentials: true
        });
      } else {
        // Company admin or data entry can only see their company's events
        res = await axios.get(`http://localhost:5000/api/events/company/${user.company}`, {
          withCredentials: true
        });
      }
      
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events');
      setLoading(false);
    }
  };

  // Handle form submission for creating a new event
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!title || !description || !date || !location || !attendees) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      const eventData = {
        title,
        description,
        date,
        location,
        attendees: parseInt(attendees),
        company: user.company
      };
      
      await axios.post('http://localhost:5000/api/events', eventData, {
        withCredentials: true
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setAttendees('');
      
      setSuccess('Event created successfully');
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  // Handle event deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        withCredentials: true
      });
      setSuccess('Event deleted successfully');
      fetchEvents();
    } catch (err) {
      setError('Failed to delete event');
    }
  };

  // Open edit modal
  const openEditModal = (event) => {
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDate(new Date(event.date).toISOString().split('T')[0]);
    setLocation(event.location);
    setAttendees(event.attendees);
    setShowModal(true);
  };

  // Handle event update
  const handleUpdate = async () => {
    try {
      const eventData = {
        title,
        description,
        date,
        location,
        attendees: parseInt(attendees)
      };
      
      await axios.put(`http://localhost:5000/api/events/${currentEvent._id}`, eventData, {
        withCredentials: true
      });
      
      setSuccess('Event updated successfully');
      setShowModal(false);
      fetchEvents();
      
      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setAttendees('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Manage Events</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Create New Event</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter event title"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter event description"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter event location"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Expected Attendees</Form.Label>
                  <Form.Control
                    type="number"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    placeholder="Enter expected number of attendees"
                    min="1"
                    required
                  />
                </Form.Group>
                
                <Button variant="primary" type="submit">
                  Create Event
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>Event List</Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : events.length === 0 ? (
                <p className="text-center">No events found</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Attendees</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event._id}>
                        <td>{event.title}</td>
                        <td>{new Date(event.date).toLocaleDateString()}</td>
                        <td>{event.location}</td>
                        <td>{event.attendees}</td>
                        <td>
                          <Button 
                            variant="info" 
                            size="sm" 
                            className="me-2"
                            onClick={() => openEditModal(event)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDelete(event._id)}
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
      
      {/* Edit Event Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Expected Attendees</Form.Label>
              <Form.Control
                type="number"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                min="1"
                required
              />
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

export default Events;
