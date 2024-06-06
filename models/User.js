const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userID: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  universityID: { type: Number, required: true },
  profilePicture: { type: String, default: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" }, //added a default pfp!
  isVerified: { type: Boolean, default: false },
  balance: {type: Number, default: 0 }, // Added this
  driverLicense: { type: String },
  carMake: { type: String },
  carModel: { type: String },
  carPlate: { type: String }
});

const User = mongoose.model('users', UserSchema);
module.exports = User;