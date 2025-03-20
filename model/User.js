const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: Map, of: Number, default: { User: 2001 } },
  verified: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  refreshToken: { type: String },
  verificationCode: { type: String },
  verificationExpirationPeriod: { type: Date },
  resetVerificationCode: { type: String },
  resetVerificationExpirationPeriod: { type: Date },
  pendingPassword: { type: String },
  majorYear: { type: String, default: "" },
  description: { type: String, default: "" },
  courses: { type: [String], default: [] },
  experience: {
    type: [
      {
        company: String,
        jobTitle: String,
        period: String
      }
    ],
    default: []
  }
});

module.exports = mongoose.model('User', userSchema);
