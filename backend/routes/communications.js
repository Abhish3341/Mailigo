const express = require('express');
const router = express.Router();
const Communication = require('../models/Communication');
const auth = require('../middleware/authMiddleware');

// Search messages
router.get('/search', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    const searchRegex = new RegExp(q, 'i');
    const messages = await Communication.find({
      $or: [
        { subject: searchRegex },
        { content: searchRegex },
        { sender: searchRegex },
        { recipient: searchRegex }
      ],
      $and: [
        {
          $or: [
            { sender: req.user.email },
            { recipient: req.user.email }
          ]
        }
      ]
    })
    .sort({ timestamp: -1 })
    .limit(50)
    .lean();

    res.json(messages);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

// Get inbox messages
router.get('/inbox', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: 'User email not found in token' });
    }

    const messages = await Communication.find({
      recipient: req.user.email,
      type: 'received'
    })
    .sort({ timestamp: -1 })
    .lean();

    res.json(messages);
  } catch (error) {
    console.error('Error fetching inbox:', error);
    res.status(500).json({ error: 'Failed to fetch inbox messages' });
  }
});

// Get sent messages
router.get('/sent', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: 'User email not found in token' });
    }

    const messages = await Communication.find({
      sender: req.user.email,
      type: 'sent'
    })
    .sort({ timestamp: -1 })
    .lean();

    res.json(messages);
  } catch (error) {
    console.error('Error fetching sent messages:', error);
    res.status(500).json({ error: 'Failed to fetch sent messages' });
  }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: 'User email not found in token' });
    }

    const message = await Communication.findOneAndUpdate(
      { 
        _id: req.params.id, 
        recipient: req.user.email,
        type: 'received'
      },
      { $set: { read: true } },
      { new: true }
    ).lean();

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Send new message
router.post('/send', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: 'User email not found in token' });
    }

    const { to, subject, content } = req.body;

    // Prevent sending to self
    if (to.toLowerCase() === req.user.email.toLowerCase()) {
      return res.status(400).json({ error: 'You cannot send emails to yourself' });
    }

    // Create sent message
    const sentMessage = await Communication.create({
      userId: req.user.id,
      type: 'sent',
      subject,
      content,
      recipient: to,
      sender: req.user.email,
      emailType: 'transactional',
      timestamp: new Date()
    });

    // Create received message for recipient
    await Communication.create({
      type: 'received',
      subject,
      content,
      recipient: to,
      sender: req.user.email,
      emailType: 'transactional',
      timestamp: new Date()
    });

    res.status(201).json(sentMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;