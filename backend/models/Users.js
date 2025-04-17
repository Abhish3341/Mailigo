const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  picture: String,
  isFirstLogin: {
    type: Boolean,
    default: true
  },
  profileUpdates: {
    count: {
      type: Number,
      default: 0
    },
    lastUpdate: Date
  },
  previousPasswords: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);