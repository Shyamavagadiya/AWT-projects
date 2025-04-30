const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '../.env' });

// Import User model
const User = require('../models/User');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    createSuperAdmin();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to create super admin
async function createSuperAdmin() {
  try {
    // Check if super admin already exists
    const existingAdmin = await User.findOne({ role: 'superadmin' });
    
    if (existingAdmin) {
      console.log('Super admin already exists:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Password: admin123 (or whatever was set)`);
    } else {
      // Create super admin
      const superAdmin = await User.create({
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: 'admin123', // Plain text password for testing
        role: 'superadmin'
      });
      
      console.log('Super admin created successfully:');
      console.log(`Email: ${superAdmin.email}`);
      console.log(`Password: admin123`);
    }
    
    // Disconnect from MongoDB
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating super admin:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}
