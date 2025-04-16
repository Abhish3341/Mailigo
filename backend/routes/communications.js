const express = require('express');
const router = express.Router();
const Communication = require('../models/Communication');
const PostmarkService = require('../services/postmarkService');

// Initialize Postmark service
const postmarkService = new PostmarkService(process.env.POSTMARK_API_KEY);

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  next();
};

// Get communications history
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const communications = await Communication.find({ userId: req.user.id })
      .sort({ timestamp: -1 });
    res.json(communications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Send email
router.post('/send', isAuthenticated, async (req, res) => {
  const { to, subject, htmlContent, textContent, emailType } = req.body;
  
  try {
    // Send email through Postmark
    const result = await postmarkService.sendEmail({
      from: process.env.POSTMARK_FROM_EMAIL,
      to,
      subject,
      htmlContent,
      textContent,
      messageStream: emailType === 'marketing' ? 'broadcast' : 'outbound'
    });
    
    if (result.success) {
      // Save communication record
      const communication = await Communication.create({
        userId: req.user.id,
        type: 'sent',
        subject,
        content: htmlContent || textContent,
        recipient: to,
        sender: process.env.POSTMARK_FROM_EMAIL,
        emailType,
        metadata: { messageId: result.messageId }
      });
      
      res.json({ success: true, communication });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get email analytics
router.get('/analytics/:messageId', isAuthenticated, async (req, res) => {
  try {
    const analytics = await postmarkService.getEmailAnalytics(req.params.messageId);
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;