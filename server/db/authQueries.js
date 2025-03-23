const { pool } = require('./index.js'); 
const bcrypt = require('bcryptjs');

/** 
 * Registers a new user by hashing their password and inserting their details into the database.
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The plain text password of the user.
 * @returns {Promise<object>} - The newly created user's ID, username, and email.
 */ 
const registerUser = async(username, email, password) => {
    try {
        // Hash the user's password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10)
        const query = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email
        `;
        const values = [username, email, hashedPassword];
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error registering user:', err);
        throw new Error('Failed to register user');
    }
};

/** 
 * Retrieves a user from the database using their email.
 * @param {string} email - The email of the user.
 * @returns {Promise<object|null>} - The user's details if found, otherwise null.
 */
const getUserByEmail = async (email) => {
    try {
        const query =  `
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

// Export functions
module.exports = { 
    registerUser, 
    getUserByEmail 
}; 
