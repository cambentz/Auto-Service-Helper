const express = require('express');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');
const { registerUser, getUserByEmail } = require('../db/authQueries'); 
require('dotenv').config(); 

const router = express.Router(); // Initialize Express router

/**
 * Route for user registration.
 * Checks if a user already exists, then registers a new user.
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists in the database
        const existingUser = await getUserByEmail(email);
        if (existingUser) 
            return res.status(400).json({ message: 'User already exists' });

        // Register the new user and return the created user details
        const newUser = await registerUser(username, email, password);
        res.status(201).json(newUser);
    } catch (err) {
        // Error log for debugging
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Server error', error: err.message});
    }
});

/**
 * Route for user login.
 * Verifies credentials and returns a JWT token if authentication is successful.
 */
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch the user by email
        const user = await getUserByEmail(email);
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });

        // Compare provided password with hashed database password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res.status(400).json({ message: 'Invalid credentials' });

        // Generate a JWT token for the authenticated user
        const token = jwt.sign({ id: user.id, username: user.username },  
            process.env.JWT_SECRET, { expiresIn: '1h'}
        );
        res.json({ token });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Export authentication routes
module.exports = router; 