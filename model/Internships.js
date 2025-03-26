const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  ID: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String, required: true },
  applyLink: { type: String, required: true },
  datePosted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Internship', internshipSchema);
