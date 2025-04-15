import { pool } from './index.js';

/**
 * Registers a new user by inserting their details into the database.
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} hashedPassword - The hashed password of the user.
 * @returns {Promise<Object>} The newly created user's ID, username, and email.
 */
export const registerUser = async (username, email, hashedPassword) => {
    try {
        const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email
    `;
        const values = [username, email, hashedPassword];

        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        throw new Error("Error registering user: " + err.message);
    }
};

/** 
 * Retrieves a user from the database using their email.
 * @param {string} email - The email of the user.
 * @returns {Promise<object|null>} - The user's details if found, otherwise null.
 */
export const getUserByEmail = async (email) => {
    try {
        const query = `
      SELECT *
      FROM users
      WHERE email = $1
    `;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (err) {
        console.error('Error fetching user by email:', err);
        throw new Error('Failed to fetch user');
    }
};

/**
 * Save a password reset token and expiration for the given user.
 * @param {string} email - User's email.
 * @param {string} token - Reset token.
 * @param {Date} expires - Expiration datetime for the token.
 * @returns {Promise<void>}
 */
export const saveResetToken = async (email, token, expires) => {
    try {
        const query = `
      UPDATE users
      SET reset_token = $1,
          reset_token_expires = $2
      WHERE email = $3
    `;
        const values = [token, expires, email];

        await pool.query(query, values);
    } catch (err) {
        throw new Error("Error saving reset token: " + err.message);
    }
};

/**
 * Retrieve a user by their reset token.
 * @param {string} token - Password reset token.
 * @returns {Promise<Object|null>} The user record, if found.
 */
export const getUserByResetToken = async (token) => {
    try {
        const query = `SELECT * FROM users WHERE reset_token = $1`;
        const values = [token];

        const result = await pool.query(query, values);
        return result.rows[0] || null;
    } catch (err) {
        throw new Error("Error retrieving user by reset token: " + err.message);
    }
};

/**
 * Update the user's password.
 * @param {number} userId - The ID of the user.
 * @param {string} newHashedPassword - New hashed password.
 * @returns {Promise<void>}
 */
export const updateUserPassword = async (userId, newHashedPassword) => {
    try {
        const query = `
      UPDATE users
      SET password = $1
      WHERE id = $2
    `;
        const values = [newHashedPassword, userId];

        await pool.query(query, values);
    } catch (err) {
        throw new Error("Error updating user password: " + err.message);
    }
};

/**
 * Clear the user's reset token and expiration.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<void>}
 */
export const clearResetToken = async (userId) => {
    try {
        const query = `
      UPDATE users
      SET reset_token = NULL,
          reset_token_expires = NULL
      WHERE id = $1
    `;
        const values = [userId];

        await pool.query(query, values);
    } catch (err) {
        throw new Error("Error clearing reset token: " + err.message);
    }
};