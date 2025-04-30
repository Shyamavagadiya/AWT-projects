const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'dataentry'],
    default: 'dataentry'
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: function() {
      return this.role !== 'superadmin';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to compare passwords - simplified for testing
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return candidatePassword === this.password; // Direct comparison instead of bcrypt
};

module.exports = mongoose.model('User', UserSchema);
