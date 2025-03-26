import { pool } from './index.js';

/**
 * Retrieves hashed password for a user.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<string>} - The user's hashed password.
 */
export const getUserHashedPassword = async (userId) => {
    try {
        const sql = `SELECT password FROM users WHERE id = $1`;
        const result = await pool.query(sql, [userId]);

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        return result.rows[0].password;
    } catch (err) {
        console.error('Error fetching hashed password:', err);
        throw new Error('Failed to fetch hashed password');
    }
};

/**
 * Retrieves user profile by ID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<object|null>} - The user's profile (excluding password).
 */
export const getUserProfile = async (userId) => {
    try {
        const sql = `SELECT id, username, email, role FROM users WHERE id = $1`;
        const result = await pool.query(sql, [userId]);
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching user profile:', err);
        throw new Error('Failed to fetch user profile');
    }
};

/** 
 * Updates the user's profile information (excluding password).
 * @param {number} userId - The ID of the user.
 * @param {string} username - The updated username. 
 * @param {string} email - The updated email.
 * @returns {Promise<object>} - The updated user profile.
 */
export const updateUserProfile = async (userId, username, email) => {
    try {
        const sql = `
        UPDATE users
        SET username = $1, email = $2
        WHERE id = $3
        RETURNING id, username, email
      `;
        const values = [username, email, userId];
        const result = await pool.query(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error updating user profile:', err);
        throw new Error('Failed to update user profile');
    }
};

/**
 * Updates the user's password with a pre-hashed password.
 * @param {number} userId - The ID of the user.
 * @param {string} newHashedPassword - The user's new hashed password.
 */
export const changeUserPassword = async (userId, newHashedPassword) => {
    try {
        const sql = `UPDATE users SET password = $1 WHERE id = $2`;
        await pool.query(sql, [newHashedPassword, userId]);
    } catch (err) {
        console.error('Error changing user password:', err);
        throw new Error('Failed to change user password');
    }
};

/**
 * Deletes a user account.
 * @param {number} userId - The ID of the user.
 */
export const deleteUser = async (userId) => {
    try {
        const sql = `DELETE FROM users WHERE id = $1`;
        await pool.query(sql, [userId]);
    } catch (err) {
        console.error('Error deleting user:', err);
        throw new Error('Failed to delete user');
    }
};