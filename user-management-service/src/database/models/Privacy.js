// Todo: I Need To Add Reverse Reference To The User 

const mongoose = require('mongoose');

// Schema for profile settings within privacy settings
const profileSettingsSchema = new mongoose.Schema({
  show_on_search_engines: {
    type: Boolean,
    required: true,
    default: true
  },
  show_courses_on_profile_page: {
    type: Boolean,
    required: true,
    default: true
  },
  show_profile_public: {
    type: Boolean,
    required: true,
    default: true
  },
  currently_learning: {
    type: Boolean,
    required: true,
    default: true
  },
  completed_courses: {
    type: Boolean,
    required: true,
    default: true
  },
  interests: {
    type: Boolean,
    required: true,
    default: true
  }
}, { _id: false }); // Prevents Mongoose from adding its own _id for embedded documents



// Main privacy settings schema
const privacySettingsSchema = new mongoose.Schema({
  privacy_settings_id: {
    type: mongoose.Schema.Types.UUID,
    required: true,
    unique: true
  },
  privacy_level: {
    type: String,
    enum: ['public', 'private', 'custom'],
    required: true,
    default: 'public'
  },
  profile_settings: {
    type: profileSettingsSchema,
    required: true
  }
});

// Create a model from the schema
const PrivacySettings = mongoose.model('PrivacySettings', privacySettingsSchema);

module.exports = PrivacySettings;