const mongoose = require('mongoose');

const courseWishlistSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.UUID,
    required: true,
    ref: 'User' // Reference to the User schema
  },
  wishlist_courses: [
    {
      course_id: {
        type: String, // Use a string or UUID depending on course ID format
        required: true
      },
      added_at: {
        type: Date,
        default: Date.now // Timestamp for when the course was added to the wishlist
      }
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const CourseWishlist = mongoose.model('CourseWishlist', courseWishlistSchema);

module.exports = CourseWishlist;
