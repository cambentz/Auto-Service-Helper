const pool = require('./index.js');
const bcrypt = require('bcryptjs');

/**
 * Validates the user's current password before allowing sensitive changes.
 * @param {number} userId - The ID of the user.
 * @param {string} currentPassword - The user's current password (plain text).
 * @returns {Promise<boolean>} - True if the password is correct, otherwise false.
 */
const validateUserPassword = async (userId, currentPassword) => {
    try {
        // Retrieve the user's password h ash from the database
        const query = `
        SELECT password
        FROM users
        WHERE id = $1
        `;
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        const hashedPassword = result.rows[0].password;
        return await bcrypt.compare(currentPassword, hashedPassword);
    } catch (err) {
        console.error('Error validating user password:', err);
        throw new Error('Failed to validate password');
    }
};

/**
 * Retrieves user profile by ID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object|null>} - The user's profile (excluding password).
 */
const getUserProfile = async (userId) => {
    try {
        const query = `
        SELECT id, username, email, role
        FROM users
        WHERE id = $1
        `;
        const result = await pool.query(query, [userId]);
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching user profile:', err);
        throw new Error ('Failed to fetch user profile');
    }
};

/** 
 * Updates the user's profile information (excluding password).
 * @param {number} userId - The ID of the user.
 * @param {string} username - The updated username. 
 * @param {string} email - The updated email.
 * @returns {Promise<object>} - The updated user profile.
 */
const updateUserProfile = async (userId, username, email) => {
    try {
        const query = `
        SELECT users
        SET username = $1, email = $2
        WHERE id = $3
        RETURNING id, username, email
        `;
        const values = [username, email, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating user profile:', err);
        throw new Error('Failed to update user profile');
    }
};

/**
 * Updates the user's password
 * @param {number} userId - The ID of the user.
 * @param {string} currentPassword - The user's current password (plain text).
 * @param {string} newPassword - The new password (plain text, will be hashed).
 */
const changeUserPassword = async (userId, currentPassword, newPassword) => {
    try {
        // Validate the current password before updating
        const isValid = await validateUserPassword(userId, currentPassword);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash the user's new password before storing it in the database
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        const query = `
        UPDATE users
        SET password = $1
        WHERE id = $2
        `;
        await pool.query(query, [newHashedPassword, userId]);
    } catch (err) {
        console.error('Error changing user password', err);
        throw new Error('Failed to change user password');
    }
};

/**
 * Deletes a user from the database
 * @param {number} userId - The ID of the user.
 * @param {string} currentPassword - The user's current password for validation.
 */
const deleteUser = async (userId, currentPassword) => {
    try {
        // Validate the current password before deleting the account
        const isValid = await validateUserPassword(userId, currentPassword);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }

        // Delete user account
        const query = `
        DELETE FROM users
        WHERE id = $2
        `;
        await pool.query(query, [userId]);
    } catch (err) {
        console.error('Error deleting user:', err);
        throw new Error('Failed to delete user');
    }
};

// Export functions
module.exports = {
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    deleteUser,
    validateUserPassword
};