const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: String, // 'sent' or 'received'
  subject: String,
  content: String,
  recipient: String,
  sender: String,
  emailType: {
    type: String,
    enum: ['onboarding', 'marketing', 'transactional', 'engagement'],
    default: 'transactional'
  },
  metadata: Object,
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Communication', communicationSchema);