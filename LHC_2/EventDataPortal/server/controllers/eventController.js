const Event = require('../models/Event');
const Company = require('../models/Company');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, attendees, company } = req.body;

    // Check if user belongs to company
    if (req.user.role !== 'superadmin' && req.user.company.toString() !== company) {
      return res.status(403).json({ message: 'Not authorized to create events for this company' });
    }

    // Check if company has an active package
    const companyData = await Company.findById(company);
    
    if (!companyData) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    if (!companyData.isActive) {
      return res.status(400).json({ message: 'Company is not active' });
    }
    
    if (!companyData.activePackage) {
      return res.status(400).json({ message: 'Company does not have an active package' });
    }
    
    // Check if company has reached event limit
    if (companyData.eventCountRemaining <= 0) {
      return res.status(400).json({ message: 'Event limit reached for the current package' });
    }
    
    // Check if package has expired
    if (companyData.packageExpiryDate && new Date(companyData.packageExpiryDate) < new Date()) {
      return res.status(400).json({ message: 'Package has expired' });
    }

    // Create event
    const event = await Event.create({
      title,
      description,
      date,
      location,
      attendees,
      company,
      createdBy: req.user._id
    });

    // Decrease event count remaining
    await Company.findByIdAndUpdate(company, {
      $inc: { eventCountRemaining: -1 }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all events (super admin only)
// @route   GET /api/events
// @access  Private/SuperAdmin
exports.getAllEvents = async (req, res) => {
  try {
    // Only super admin can access all events
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const events = await Event.find({})
      .populate('company', 'name')
      .populate('createdBy', 'name email');
      
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get company events
// @route   GET /api/events/company/:companyId
// @access  Private
exports.getCompanyEvents = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    
    // Check if user has access to company
    if (req.user.role !== 'superadmin' && req.user.company.toString() !== companyId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const events = await Event.find({ company: companyId })
      .populate('createdBy', 'name email');
      
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('company', 'name')
      .populate('createdBy', 'name email');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user has access to event
    if (req.user.role !== 'superadmin' && req.user.company.toString() !== event.company._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, attendees } = req.body;
    
    // Find event
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user has access to event
    if (req.user.role !== 'superadmin' && req.user.company.toString() !== event.company.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update event
    event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, location, attendees },
      { new: true, runValidators: true }
    );
    
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user has access to event
    if (req.user.role !== 'superadmin' && req.user.company.toString() !== event.company.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await event.remove();
    
    // Increase event count remaining for company
    await Company.findByIdAndUpdate(event.company, {
      $inc: { eventCountRemaining: 1 }
    });
    
    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
