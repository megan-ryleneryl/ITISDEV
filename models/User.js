const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: {
      type: Number,
      required: true
  },
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
  phone_number: {
      type: String
  },
  university_id: {
      type: Number,
      required: true
  },
  profile_picture: {
      type: String
  },
  is_verified: {
      type: Boolean,
      default: false
  },
  created_at: {
      type: Date,
      default: Date.now
  },
  updated_at: {
      type: Date,
      default: Date.now
  }
});

const User = mongoose.model('users', UserSchema);
module.exports = User;