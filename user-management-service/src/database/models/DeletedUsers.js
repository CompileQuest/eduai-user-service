
const mongoose = require('mongoose');

// Define the schema for account deletion events
const accountDeletionSchema = new mongoose.Schema({
  deleted_account_id: {
    type: mongoose.Schema.Types.UUID, // UUID for deletion event
    required: true,
    unique: true
  },
  user_id: {
    type: mongoose.Schema.Types.UUID, // Reference to the user who was deleted
    required: true,
    ref: 'User'  // Assuming you have a 'User' model for references
  },
  deletion_date: {
    type: Date,
    required: true,
    default: Date.now // Timestamp when the account was deleted
  },
  reason_for_deletion: {
    type: String,
    maxlength: 500,  // Optional field with a maximum length
    default: "Not specified"  // Default if no reason is given
  },
  deletion_method: {
    type: String,
    enum: ['self-initiated', 'admin-initiated'], // Validation for method of deletion
    required: true
  },
  data_retention_until: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.deletion_date;  // Ensure data retention is after the deletion date
      },
      message: 'Data retention date must be after the deletion date'
    }
  },
  recovery_available_until: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        return value > this.deletion_date;  // Ensure recovery is after the deletion date
      },
      message: 'Recovery availability date must be after the deletion date'
    }
  },
  ip_address: {
    type: String,
    match: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, // Basic validation for IPv4 addresses
    default: 'Unknown'
  },
  device_info: {
    type: String,
    maxlength: 500,  // Optional field for storing information about the device used
    default: 'Unknown'
  },
  data_backup_status: {
    type: Boolean,
    default: false, // Whether the user's data was backed up before deletion
  },
  notes: {
    type: String,
    maxlength: 1000,  // Optional field for any additional notes or special circumstances
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now  // Timestamp when the deletion record was created
  },
  updated_at: {
    type: Date,
    default: Date.now,  // Timestamp for when the deletion record was last updated
  },
  is_recovered: {
    type: Boolean,
    default: false  // Whether the account has been recovered
  }
});

// Create an index to make searches on deleted_account_id and user_id efficient
accountDeletionSchema.index({ deleted_account_id: 1 });
accountDeletionSchema.index({ user_id: 1 });

const AccountDeletion = mongoose.model('AccountDeletion', accountDeletionSchema);

module.exports = AccountDeletion;
