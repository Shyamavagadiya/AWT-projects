const express = require('express');
const router = express.Router();
const { 
  createPackage, 
  getAllPackages, 
  getPackage, 
  updatePackage, 
  deletePackage 
} = require('../controllers/packageController');
const { protect, superAdmin } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Super admin only routes
router.post('/', superAdmin, createPackage);
router.put('/:id', superAdmin, updatePackage);
router.delete('/:id', superAdmin, deletePackage);

// Public routes (still need authentication)
router.get('/', getAllPackages);
router.get('/:id', getPackage);

module.exports = router;
