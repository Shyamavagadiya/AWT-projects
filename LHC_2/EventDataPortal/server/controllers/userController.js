const User = require('../models/User');

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Set company based on current user's company (unless super admin)
    let company = req.body.company;
    if (req.user.role !== 'superadmin') {
      company = req.user.company;
    }
    
    // Validate role
    if (req.user.role === 'admin' && role === 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to create super admin' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      company
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users (super admin only)
// @route   GET /api/users
// @access  Private/SuperAdmin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get company users
// @route   GET /api/users/company/:companyId
// @access  Private
exports.getCompanyUsers = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    
    // Check if user has access to company
    if (req.user.role !== 'superadmin' && req.user.company.toString() !== companyId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const users = await User.find({ company: companyId }).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has access
    if (req.user.role !== 'superadmin' && 
        req.user.role !== 'admin' && 
        req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // If admin, check if user belongs to same company
    if (req.user.role === 'admin' && 
        user.company && 
        req.user.company && 
        user.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    // Find user
    let user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has access
    if (req.user.role !== 'superadmin' && 
        req.user.role !== 'admin' && 
        req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // If admin, check if user belongs to same company
    if (req.user.role === 'admin' && 
        user.company && 
        req.user.company && 
        user.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Admin cannot change role to superadmin
    if (req.user.role === 'admin' && role === 'superadmin') {
      return res.status(403).json({ message: 'Not authorized to change role to super admin' });
    }
    
    // Update user
    const updateData = { name, email };
    
    // Only allow role change if admin or superadmin
    if ((req.user.role === 'admin' || req.user.role === 'superadmin') && role) {
      updateData.role = role;
    }
    
    user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting superadmin
    if (user.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot delete super admin' });
    }
    
    // If admin, check if user belongs to same company
    if (req.user.role === 'admin' && 
        user.company && 
        req.user.company && 
        user.company.toString() !== req.user.company.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await user.remove();
    
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
