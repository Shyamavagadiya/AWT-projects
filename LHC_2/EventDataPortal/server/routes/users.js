const express = require('express');
const router = express.Router();
const { 
  createUser, 
  getAllUsers, 
  getCompanyUsers,
  getUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { protect, admin, superAdmin, checkCompany } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Super admin routes
router.get('/', superAdmin, getAllUsers);

// Admin routes
router.post('/', admin, createUser);
router.get('/company/:companyId', checkCompany, getCompanyUsers);

// Get, update, delete specific user
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', admin, deleteUser);

module.exports = router;
