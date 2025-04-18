const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);