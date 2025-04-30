const express = require('express');
const router = express.Router();
const { 
  createEvent, 
  getAllEvents, 
  getCompanyEvents,
  getEvent, 
  updateEvent, 
  deleteEvent 
} = require('../controllers/eventController');
const { protect, checkCompany } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Create event
router.post('/', createEvent);

// Get all events (super admin only)
router.get('/', getAllEvents);

// Get company events
router.get('/company/:companyId', checkCompany, getCompanyEvents);

// Get, update, delete specific event
router.get('/:id', getEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
