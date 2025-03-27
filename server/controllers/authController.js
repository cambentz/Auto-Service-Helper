/**
 * Controller functions for user authentication.
 */
import {
    registerUser,
    getUserByEmail,
    getUserByResetToken,
    updateUserPassword,
    saveResetToken,
    clearResetToken
} from "../db/authQueries.js";

import { hashPassword, comparePasswords } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { sendResetEmail } from "../utils/emailService.js";  
import crypto from 'crypto';


/**
 * Registers a new user by checking if one exists, then inserting them.
 */
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const existingUser = await getUserByEmail(email);
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await hashPassword(password);
        const newUser = await registerUser(username, email, hashedPassword);

        res.status(201).json(newUser);
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

/**
 * Logs in a user by validating credentials and issuing a JWT.
 */
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await getUserByEmail(email);
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const validPassword = await comparePasswords(password, user.password);
        if (!validPassword)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken({ id: user.id, username: user.username });
        res.json({ token });
    } catch (err) {
        console.error("Error logging in user:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

/**
 * Handles a user's password reset request by generating a secure token and emailing them a reset link.
 */
export async function requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: 'No user found with that email address.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        await saveResetToken(email, token, tokenExpiry);

        const resetLink = `https://gesture-garage.onrender.com/reset-password?token=${token}`;
        await sendResetEmail(email, resetLink);

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({ error: 'Something went wrong while processing your request.' });
    }
}

/**
* Reset the user's password given a valid token and new password.
*/
export async function resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
        const user = await getUserByResetToken(token);

        if (!user || new Date(user.reset_token_expires) < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await updateUserPassword(user.id, hashedPassword);
        await clearResetToken(user.id);

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ error: 'Failed to reset password.' });
    }
}