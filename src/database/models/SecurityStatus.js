// Todo: I Need To Add Reverse Reference To The User 

const mongoose = require('mongoose');

// Define the schema for security details
const securitySchema = new mongoose.Schema({
  security_id: {
    type: mongoose.Schema.Types.UUID, // UUID for security details
    required: true,
    unique: true
  },
  user_id: {
    type: mongoose.Schema.Types.UUID, // Foreign key to the user table
    required: true,
    ref: 'User' // Assuming you have a 'User' model to reference the user
  },
  login_attempts: {
    type: Number,
    default: 0, // Number of failed login attempts
    min: 0
  },
  account_locked: {
    type: Boolean,
    default: false, // Whether the account is locked
  },
  last_failed_login: {
    type: Date, // Timestamp for the last failed login attempt
    default: null
  },
  two_factor_enabled: {
    type: Boolean,
    default: false, // Whether two-factor authentication is enabled
  },
  two_factor_method: {
    type: String,
    enum: ['sms', 'authenticator_app', 'email'], // Type of 2FA method
    default: null
  },
  password_last_changed: {
    type: Date, // Timestamp for when the password was last changed
    required: true
  },
  ip_address_last_failed_login: {
    type: String, // Tracks IP address from which the last failed login attempt was made
    default: null,
    match: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // Basic validation for IPv4 addresses
    default: null
  },
  device_info_last_failed_login: {
    type: String, // Device information used during the last failed login
    maxlength: 500, // Limit length of the device info
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now  // Timestamp when the security record was created
  },
  updated_at: {
    type: Date,
    default: Date.now  // Timestamp for when the security record was last updated
  }
});

// Pre-save hook to update the `updated_at` timestamp
securitySchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Create an index for faster lookup based on user_id and security_id
securitySchema.index({ user_id: 1 });
securitySchema.index({ security_id: 1 });

const Security = mongoose.model('Security', securitySchema);

module.exports = Security;
