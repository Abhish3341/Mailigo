const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['sent', 'received'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  emailType: {
    type: String,
    enum: ['onboarding', 'marketing', 'transactional', 'engagement'],
    default: 'transactional'
  },
  metadata: {
    type: Map,
    of: String,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
communicationSchema.index({ recipient: 1, type: 1 });
communicationSchema.index({ sender: 1, type: 1 });
communicationSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Communication', communicationSchema);