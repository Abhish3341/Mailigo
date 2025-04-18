const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const OnboardedUser = require("../models/OnboardedUser");
const PostmarkService = require('../services/postmarkService');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

const emailService = new PostmarkService();

// Google OAuth Route
router.post('/google', async (req, res) => {
  try {
    const { email, given_name, family_name, picture, sub } = req.body;

    if (!email || !given_name || !family_name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user is already onboarded
    const isOnboarded = await OnboardedUser.findOne({ email });

    // Look for existing user
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user
      user = await User.create({
        firstname: given_name,
        lastname: family_name,
        email,
        picture,
        googleId: sub,
        isFirstLogin: !isOnboarded
      });

      // Send welcome email to new users
      if (!isOnboarded) {
        await emailService.sendOnboardingEmail({
          email,
          firstname: given_name
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email, 
        firstname: user.firstname, 
        lastname: user.lastname 
      },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        picture: user.picture,
        isFirstLogin: !isOnboarded
      },
      token
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        picture: user.picture,
        isFirstLogin: user.isFirstLogin,
        profileUpdates: {
          count: user.profileUpdates.count,
          remaining: 5 - user.profileUpdates.count
        }
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { firstname, lastname } = req.body;

    // For first update after registration
    if (user.isFirstLogin) {
      user.firstname = firstname;
      user.lastname = lastname;
      user.isFirstLogin = false;
      user.profileUpdates.count = 0;
      await user.save();

      const token = jwt.sign(
        { id: user._id, email: user.email, firstname, lastname },
        process.env.SECRET_KEY,
        { expiresIn: '24h' }
      );

      return res.json({
        message: "Profile updated successfully",
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          isFirstLogin: false
        },
        token
      });
    }

    // Check update limit
    if (user.profileUpdates.count >= 5) {
      return res.status(403).json({
        error: "You've reached the maximum number of profile updates"
      });
    }

    // Update profile
    user.firstname = firstname;
    user.lastname = lastname;
    user.profileUpdates.count += 1;
    user.profileUpdates.lastUpdate = new Date();
    await user.save();

    // Generate new token with updated info
    const token = jwt.sign(
      { id: user._id, email: user.email, firstname, lastname },
      process.env.SECRET_KEY,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Profile updated successfully",
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        isFirstLogin: false
      },
      remainingUpdates: 5 - user.profileUpdates.count,
      token
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

module.exports = router;