const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: Map, of: Number, default: { User: 2001 } },
  verified: { type: Boolean, default: false },
  refreshToken: { type: String },
  verificationCode: { type: String },
  verificationExpirationPeriod: { type: Date },
  resetVerificationCode: { type: String },
  resetVerificationExpirationPeriod: { type: Date },
  pendingPassword: { type: String },
});

module.exports = mongoose.model('User', userSchema);
