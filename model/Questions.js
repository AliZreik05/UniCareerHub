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
        time: { type: Date, default: Date.now },
        flagged: { type: Boolean, default: false },
        upvotes: { type: Number, default: 0 },
        upvotedBy: { type: [String], default: [] }
      }
    ], 
    default: [] 
  },
  flagged: { type: Boolean, default: false },
  flagCount: { type: Number, default: 0 },
  flaggedBy: { type: [String], default: [] }
});

module.exports = mongoose.model('Question', questionSchema);
