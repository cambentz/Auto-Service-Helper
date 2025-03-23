const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getUserProfile, updateUserProfile, changeUserPassword, deleteUser, validateUserPassword } = require('../db/authQueries');

const router = express.Router();

/** 
 * Route for user profile retrieval.
 * Requires authentication.
 */
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await getUserProfile(req.user.id);
        res.json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

/** 
 * Route for updating user profile.
 * Requires authentication.
 */
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { username, email } = req.body;
        const updatedUser = await updateUserProfile(req.user.id, username, email);
        res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Route for changing user password.
 * Requires authentication.
 */
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        // Validate current password before updating
        const isValid = await validateUserPassword(req.user.id, currentPassword);
        if (!isValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        await changeUserPassword(req.user.id, newPassword); 
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Error changing user password:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * Route for deleting user account.
 * Requires authentication.
 */
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const { currentPassword } = req.body;
        
        // Validate current password before deleting account
        const isValid = await validateUserPassword(req.user.id, currentPassword);
        if (!isValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        await deleteUser(req.user.id); 
        res.json({ message: 'User account deleted' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export user-related routes
module.exports = router;