const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderID: { type: Number, ref: 'User' }, // Changed both objectids to Numbers
  receiverID: { type: Number, ref: 'User' }, 
  message: { type: String, required: true },
  date: { type: Date, default: Date.now } // Renamed from created_at to date
});

const Message = mongoose.model('messages', MessageSchema);
module.exports = Message;