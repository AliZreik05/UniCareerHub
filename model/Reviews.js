const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  ID: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  companyName: { type: String },
  review: { type: String, required: true },
  industry: { type: String },
  rating: { type: Number, required: true },
  time: { type: Date, default: Date.now },
  flagged: { type: Boolean, default: false },
  flagCount: { type: Number, default: 0 },
  flaggedBy: { type: [String], default: [] },
  upvotes: { type: Number, default: 0 },
upvotedBy: { type: [String], default: [] },
reportReasons: { type: [String], default: [] }

});

module.exports = mongoose.model('Review', reviewSchema);
