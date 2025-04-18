const express = require('express');
const router = express.Router();
const Communication = require('../models/Communication');
const auth = require('../middleware/authMiddleware');
const PostmarkService = require('../services/postmarkService');
const emailService = new PostmarkService();

// Get inbox messages
router.get('/inbox', auth, async (req, res) => {
  try {
    const messages = await Communication.find({
      recipient: req.user.email,
      type: 'received'
    }).sort({ timestamp: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching inbox:', error);
    res.status(500).json({ error: 'Failed to fetch inbox messages' });
  }
});

// Get sent messages
router.get('/sent', auth, async (req, res) => {
  try {
    const messages = await Communication.find({
      sender: req.user.email,
      type: 'sent',
      recipient: { $ne: req.user.email } // Exclude self-sent messages
    }).sort({ timestamp: -1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({ error: 'Failed to fetch sent messages' });
  }
});

// Send new message
router.post('/send', auth, async (req, res) => {
  try {
    const { to, subject, content } = req.body;

    // Prevent sending to self
    if (to.toLowerCase() === req.user.email.toLowerCase()) {
      return res.status(400).json({ error: 'You cannot send emails to yourself' });
    }

    const newMessage = await Communication.create({
      userId: req.user.id,
      type: 'sent',
      subject,
      content,
      recipient: to,
      sender: req.user.email,
      emailType: 'transactional',
      timestamp: new Date()
    });

    // Create a corresponding received message for the recipient
    await Communication.create({
      type: 'received',
      subject,
      content,
      recipient: to,
      sender: req.user.email,
      emailType: 'transactional',
      timestamp: new Date()
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Mark message as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const message = await Communication.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.email },
      { $set: { read: true } },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Send engagement email (feedback request)
router.post('/request-feedback', auth, async (req, res) => {
  try {
    const result = await emailService.sendEngagementEmail(req.user, 'feedback');
    res.json(result);
  } catch (error) {
    console.error('Failed to send feedback request:', error);
    res.status(500).json({ error: 'Failed to send feedback request' });
  }
});

// Send marketing campaign
router.post('/marketing-campaign', auth, async (req, res) => {
  try {
    const { subject, content, recipients } = req.body;
    
    const results = await Promise.all(
      recipients.map(recipient => 
        emailService.sendMarketingEmail(recipient, { subject, content })
      )
    );
    
    res.json({ results });
  } catch (error) {
    console.error('Failed to send marketing campaign:', error);
    res.status(500).json({ error: 'Failed to send marketing campaign' });
  }
});

// Send urgent notification
router.post('/notify', auth, async (req, res) => {
  try {
    const { subject, content, recipient } = req.body;
    
    const result = await emailService.sendNoReplyEmail(
      { email: recipient },
      { subject, content }
    );
    
    res.json(result);
  } catch (error) {
    console.error('Failed to send notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;