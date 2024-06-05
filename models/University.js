const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
  universityID: { type: Number, required: true },
  name: { type: String, required: true }
});

const University = mongoose.model('universities', UniversitySchema);
module.exports = University;