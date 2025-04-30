const express = require('express');
const router = express.Router();
const { 
  getAllCompanies, 
  getCompany, 
  approveCompany, 
  assignPackage 
} = require('../controllers/companyController');
const { protect, superAdmin } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Super admin only routes
router.get('/', superAdmin, getAllCompanies);
router.put('/:id/approve', superAdmin, approveCompany);
router.put('/:id/assign-package', superAdmin, assignPackage);

// Get specific company
router.get('/:id', getCompany);

module.exports = router;
