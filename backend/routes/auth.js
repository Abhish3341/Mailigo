const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Google OAuth Route
router.post('/google', async (req, res) => {
    try {
        const { email, given_name, family_name, picture, sub } = req.body;

        // Validate required fields
        if (!email || !given_name || !family_name) {
            return res.status(400).json({ 
                error: "Missing required fields",
                details: { email, given_name, family_name }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const token = jwt.sign(
                { 
                    id: existingUser._id, 
                    email: existingUser.email,
                    firstname: existingUser.firstname,
                    lastname: existingUser.lastname
                },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            return res.json({
                user: {
                    id: existingUser._id,
                    firstname: existingUser.firstname,
                    lastname: existingUser.lastname,
                    email: existingUser.email,
                    picture: existingUser.picture || '',
                    isFirstLogin: existingUser.isFirstLogin
                },
                token
            });
        }

        // Create new user for Google OAuth
        const newUser = await User.create({
            firstname: given_name,
            lastname: family_name,
            email: email,
            picture: picture || '',
            googleId: sub,
            isFirstLogin: true
        });

        const token = jwt.sign(
            { 
                id: newUser._id, 
                email: newUser.email,
                firstname: newUser.firstname,
                lastname: newUser.lastname
            },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                picture: newUser.picture || '',
                isFirstLogin: true
            },
            token
        });
    } catch (error) {
        console.error('Google OAuth error:', error);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message 
        });
    }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            user: {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                isFirstLogin: user.isFirstLogin
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

module.exports = router;