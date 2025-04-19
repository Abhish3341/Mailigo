const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const OnboardedUser = require("../models/OnboardedUser");
const PostmarkService = require('../services/postmarkService');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
require('dotenv').config();

const emailService = new PostmarkService();

// User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                error: existingUser.googleId ? 
                    "This email is registered with Google. Please use Google Sign In." :
                    "Email already registered. Please login."
            });
        }

        const isOnboarded = await OnboardedUser.findOne({ email });
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            isFirstLogin: !isOnboarded,
            profileUpdates: {
                count: 0,
                lastUpdate: null
            }
        });

        const token = jwt.sign(
            { id: user._id, email, firstname, lastname },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        if (!isOnboarded) {
            await emailService.sendOnboardingEmail({
                email: user.email,
                firstname: user.firstname
            });
        }

        res.status(201).json({
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                isFirstLogin: !isOnboarded,
                profileUpdates: {
                    count: 0,
                    remaining: 5
                }
            },
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: "Registration failed" });
    }
});

// Google OAuth Route
router.post('/google', async (req, res) => {
    try {
        const { email, given_name, family_name, picture, sub } = req.body;

        if (!email || !given_name || !family_name) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const isOnboarded = await OnboardedUser.findOne({ email });
        let user = await User.findOne({ email });

        if (user && !user.googleId) {
            return res.status(400).json({
                error: "Please login with email and password instead."
            });
        }

        if (!user) {
            user = await User.create({
                firstname: given_name,
                lastname: family_name,
                email,
                picture,
                googleId: sub,
                isFirstLogin: !isOnboarded,
                profileUpdates: {
                    count: 0,
                    lastUpdate: null
                }
            });

            if (!isOnboarded) {
                await emailService.sendOnboardingEmail({
                    email,
                    firstname: given_name
                });
            }
        }

        const token = jwt.sign(
            { id: user._id, email, firstname: user.firstname, lastname: user.lastname },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                picture: user.picture,
                isFirstLogin: !isOnboarded,
                profileUpdates: {
                    count: user.profileUpdates.count,
                    remaining: 5 - user.profileUpdates.count
                }
            },
            token
        });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({ error: "Authentication failed" });
    }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            user: {
                id: user._id,
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

// Update current user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { firstname, lastname } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check update limit
        if (!user.isFirstLogin && user.profileUpdates.count >= 5) {
            return res.status(403).json({
                error: "You have reached the maximum number of profile updates"
            });
        }

        // Update user profile
        user.firstname = firstname;
        user.lastname = lastname;
        
        // Increment update count if not first login
        if (!user.isFirstLogin) {
            user.profileUpdates.count += 1;
            user.profileUpdates.lastUpdate = new Date();
        } else {
            user.isFirstLogin = false;
        }

        await user.save();

        // Return updated user data
        res.json({
            user: {
                id: user._id,
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
        console.error('Profile update error:', error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

module.exports = router;