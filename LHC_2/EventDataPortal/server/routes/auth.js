const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const { registerCompany } = require('../controllers/companyController');
const { protect } = require('../middleware/auth');

// Register user
router.post('/register', register);

// Register company with admin
router.post('/register-company', registerCompany);

// Login user
router.post('/login', login);

// Logout user
router.post('/logout', logout);

// Get current user
router.get('/me', protect, getMe);

module.exports = router;
