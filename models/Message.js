const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  message: {
      type: String,
      required: true
  },
  created_at: {
      type: Date,
      default: Date.now
  }
});

const Message = mongoose.model('messages', MessageSchema);
module.exports = Message