const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  ID: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  question: { type: String, required: true },
  time: { type: Date, default: Date.now },
  replies: { 
    type: [
      {
        user: { type: String, required: true },
        reply: { type: String, required: true },
        time: { type: Date, default: Date.now }
      }
    ], 
    default: []
  }
});

module.exports = mongoose.model('Question', questionSchema);
