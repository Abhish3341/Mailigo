const express = require('express');
const router = express.Router();
const Communication = require('../models/Communication');
const auth = require('../middleware/authMiddleware');

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
      type: 'sent'
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

module.exports = router;