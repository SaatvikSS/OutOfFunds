const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Input validation middleware
const validateRegistration = (req, res, next) => {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ 
            status: 'error',
            message: 'All fields are required'
        });
    }
    
    if (password.length < 6) {
        return res.status(400).json({
            status: 'error',
            message: 'Password must be at least 6 characters long'
        });
    }
    
    next();
};

// Register route
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const { email, password, firstName, lastName, preferences } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already registered'
            });
        }
        
        // Create new user
        const user = new User({
            email,
            password,
            firstName,
            lastName,
            preferences: preferences || {}
        });
        
        await user.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
            { expiresIn: '7d' }
        );
        
        // Set session
        req.session.userId = user._id;
        
        res.status(201).json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error during registration'
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
            { expiresIn: '7d' }
        );
        
        // Set session
        req.session.userId = user._id;
        
        res.json({
            status: 'success',
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error during login'
        });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }
        
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
        );
        
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        
        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error fetching user'
        });
    }
});

// Update user preferences
router.put('/preferences', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }
        
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
        );
        
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { $set: { preferences: req.body } },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }
        
        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error updating preferences'
        });
    }
});

// Save search
router.post('/searches', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const { location, budget, studyLevel } = req.body;
        
        user.savedSearches.push({
            location,
            budget,
            studyLevel,
            timestamp: new Date()
        });

        await user.save();

        res.json({
            status: 'success',
            data: {
                savedSearches: user.savedSearches
            }
        });

    } catch (error) {
        console.error('Save search error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to save search'
        });
    }
});

module.exports = router;
