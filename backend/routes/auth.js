const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const OnboardedUser = require("../models/OnboardedUser");
const PostmarkService = require('../services/postmarkService');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

const emailService = new PostmarkService();

// User Registration Route
router.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                error: existingUser.googleId ? 
                    "This email is registered with Google. Please use Google Sign In." :
                    "Email already registered. Please login."
            });
        }

        // Check onboarding status
        const isOnboarded = await OnboardedUser.findOne({ email });

        // Create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            isFirstLogin: !isOnboarded
        });

        // Generate token
        const token = jwt.sign(
            { id: user._id, email, firstname, lastname },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Send onboarding email if needed
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
                isFirstLogin: !isOnboarded
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

        // Check onboarding status
        const isOnboarded = await OnboardedUser.findOne({ email });

        // Check existing user
        let user = await User.findOne({ email });
        
        if (user && !user.googleId) {
            return res.status(400).json({
                error: "Please login with email and password instead."
            });
        }

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

            // Send onboarding email if needed
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
                isFirstLogin: !isOnboarded
            },
            token
        });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({ error: "Authentication failed" });
    }
});

module.exports = router;