// todo create wishlist collection and reference it with the user
const mongoose = require("mongoose")
// Schema for embedded cart items
const cartItemSchema = new mongoose.Schema({
    item_id: {
      type: mongoose.Schema.Types.UUID, // UUID for item ID
      required: true,
      unique: true
    },
    product_name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }, { _id: false }); // Prevents Mongoose from adding its own _id for embedded documents
  
// Social profiles schema embedded within the user model
const socialProfilesSchema = new mongoose.Schema({
    twitter: {
      profile_name: String,
      username: String
    },
    facebook: {
      profile_name: String,
      username: String
    },
    instagram: {
      profile_name: String,
      username: String
    },
    linkedin: {
      profile_url: String
    },
    youtube: {
      profile_url: String
    }
  }, { _id: false });


const linkedAccountsSchema = new mongoose.Schema({
    facebook: {
      linked: { type: Boolean, default: false },
      one_click_login: { type: Boolean, default: false },
      recommendations_enabled: { type: Boolean, default: false }
    },
    google: {
      linked: { type: Boolean, default: false },
      one_click_login: { type: Boolean, default: false },
      recommendations_enabled: { type: Boolean, default: false }
    },
    github: {
      linked: { type: Boolean, default: false },
      one_click_login: { type: Boolean, default: false },
      recommendations_enabled: { type: Boolean, default: false }
    },
    twitter: {
      linked: { type: Boolean, default: false },
      one_click_login: { type: Boolean, default: false },
      recommendations_enabled: { type: Boolean, default: false }
    }});

    const notificationSettingsSchema = new mongoose.Schema({
      enabled: { type: Boolean, required: true, default: true },
      security_alerts: { type: Boolean, default: true },
      news: { type: Boolean, default: true },
      courses: { type: Boolean, default: true },
      featured_content: { type: Boolean, default: true },
      product_updates: { type: Boolean, default: true },
      events_and_offers: { type: Boolean, default: true },
      unsubscribe_all: { type: Boolean, default: false }
    }, { _id: false });

    const billingInfoSchema = new mongoose.Schema({
      address_line_1: { type: String, required: true },
      address_line_2: { type: String },
      city: { type: String, required: true },
      state: { type: String },
      postal_code: { type: String, required: true },
      country: { type: String, required: true },
      payment_method: {
        card_number: { type: String, required: true, match: /^\d{16}$/ }, // Simple card number validation
        expiry_date: { type: String, required: true, match: /^(0[1-9]|1[0-2])\/\d{2}$/ }, // MM/YY format
        cardholder_name: { type: String, required: true }
      }
    }, { _id: false });

// todo convert notifcation settings to embedded done
// todo add the wishlist done
// todo add address field 1 and 2  done
// todo add the country done
// todo first name and last name done
//here we go not done
const userSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.UUID, // UUID for user ID
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password_hash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Basic email validation
    },
    role: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        match: /^\d+$/ // Ensures phone contains only digits
    },
    birthday: {
        type: Date
    },
    billing_info: {
      type: billingInfoSchema, // Embedded billing info schema
      required: true
    },
    bio: {
        type: String,
        maxlength: 500
    },
    timezone: {
        type: String
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    address_line_1: {
      type: String,
      required: true
    },
    address_line_2: {
      type: String
    },
    country: {
      type: String,
      required: true
    },
    profile_picture_url: {
        type: String,
        match: /^https?:\/\/.+$/ // Basic URL validation
    },
    created_at: { 
        type: Date,
        default: Date.now
    },
    updated_at: { // todo: make sure that you update the field everytime you update the collection 
        type: Date,
        default: Date.now
    },
    last_login: { 
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    notification_settings: {
      type: notificationSettingsSchema,
      default: {}
    },
    privacy_setting: {
        type: mongoose.Schema.Types.UUID
    },
    wishlist_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the wishlist collection//////////////////////////
      ref: 'CourseWishlist'
    },
    linked_accounts: {
      type: linkedAccountsSchema,
      default: {}
    },
    purchased_courses: [
        {
            course_id: {
                type: mongoose.Schema.Types.UUID,
                required: true
            }
        }
    ],
    cart: [cartItemSchema],
    security_status: {
        type: mongoose.Schema.Types.UUID
    },
    social_profiles: {
      type: socialProfilesSchema,
      default: {}
    },
      linked_accounts: {
        type: linkedAccountsSchema, // Embed the linked accounts schema
        default: {}
      },
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;

