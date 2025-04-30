const Package = require('../models/Package');

// @desc    Create a new package
// @route   POST /api/packages
// @access  Private/SuperAdmin
exports.createPackage = async (req, res) => {
  try {
    const { name, description, price, duration, eventLimit } = req.body;

    // Create package
    const package = await Package.create({
      name,
      description,
      price,
      duration,
      eventLimit
    });

    res.status(201).json(package);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all packages
// @route   GET /api/packages
// @access  Private
exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find({});
    res.json(packages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get package by ID
// @route   GET /api/packages/:id
// @access  Private
exports.getPackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.json(package);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/SuperAdmin
exports.updatePackage = async (req, res) => {
  try {
    const { name, description, price, duration, eventLimit, isActive } = req.body;
    
    // Find package
    let package = await Package.findById(req.params.id);
    
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Update package
    package = await Package.findByIdAndUpdate(
      req.params.id,
      { name, description, price, duration, eventLimit, isActive },
      { new: true, runValidators: true }
    );
    
    res.json(package);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/SuperAdmin
exports.deletePackage = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    await package.remove();
    
    res.json({ message: 'Package removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
