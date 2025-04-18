const mongoose = require('mongoose');

const onboardedUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  onboardedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('OnboardedUser', onboardedUserSchema);