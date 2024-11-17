// todo create wishlist collection and reference it with the user

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
    role_id: {
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
    billing_info_id: {
        type: mongoose.Schema.Types.UUID,
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
    profile_picture_url: {
        type: String,
        match: /^https?:\/\/.+$/ // Basic URL validation
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
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
    notification_settings_id: {
        type: mongoose.Schema.Types.UUID // linked with another collection using its id 
    },
    privacy_setting: {
        type: mongoose.Schema.Types.UUID
    },
    linked_accounts: {
        type: mongoose.Schema.Types.UUID
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

