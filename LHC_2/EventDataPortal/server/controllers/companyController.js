const Company = require('../models/Company');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new company with admin
// @route   POST /api/auth/register-company
// @access  Public
exports.registerCompany = async (req, res) => {
  try {
    const { company, admin } = req.body;

    // Check if company already exists
    const companyExists = await Company.findOne({ name: company.name });
    if (companyExists) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    // Check if admin email already exists
    const adminExists = await User.findOne({ email: admin.email });
    if (adminExists) {
      return res.status(400).json({ message: 'Admin email already exists' });
    }

    // Create company (inactive by default, pending approval)
    const newCompany = await Company.create({
      name: company.name,
      address: company.address,
      contactPerson: company.contactPerson,
      contactEmail: company.contactEmail,
      contactPhone: company.contactPhone,
      isActive: false // Pending approval
    });

    // Create admin user
    const adminUser = await User.create({
      name: admin.name,
      email: admin.email,
      password: admin.password,
      role: 'admin',
      company: newCompany._id
    });

    res.status(201).json({
      message: 'Company registration successful. Pending approval by super admin.',
      company: {
        _id: newCompany._id,
        name: newCompany.name,
        isActive: newCompany.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private/SuperAdmin
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('activePackage');
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Check if user has access to company
    if (req.user.role !== 'superadmin' && 
        (!req.user.company || req.user.company.toString() !== company._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve company
// @route   PUT /api/companies/:id/approve
// @access  Private/SuperAdmin
exports.approveCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    company.isActive = true;
    await company.save();
    
    res.json({ message: 'Company approved successfully', company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Assign package to company
// @route   PUT /api/companies/:id/assign-package
// @access  Private/SuperAdmin
exports.assignPackage = async (req, res) => {
  try {
    const { packageId } = req.body;
    
    if (!packageId) {
      return res.status(400).json({ message: 'Package ID is required' });
    }
    
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    
    // Get package details
    const packageDetails = await Package.findById(packageId);
    
    if (!packageDetails) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Update company with package details
    company.activePackage = packageId;
    company.eventCountRemaining = packageDetails.eventLimit;
    
    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + packageDetails.duration);
    company.packageExpiryDate = expiryDate;
    
    await company.save();
    
    res.json({ 
      message: 'Package assigned successfully', 
      company 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
