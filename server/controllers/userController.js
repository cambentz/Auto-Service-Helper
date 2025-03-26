/**
 * Controller functions for user account management.
 */
import {
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    deleteUser,
    getUserHashedPassword
} from "../db/userQueries.js";
import { comparePasswords, hashPassword } from "../utils/password.js";

/**
 * Get user profile info.
 */
export async function getProfile(req, res) {
    try {
        const user = await getUserProfile(req.user.id);
        res.json(user);
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * Update user profile.
 */
export async function updateProfile(req, res) {
    try {
        const { username, email } = req.body;
        const updatedUser = await updateUserProfile(req.user.id, username, email);
        res.json(updatedUser);
    } catch (err) {
        console.error("Error updating user profile:", err);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * Change user password.
 */
export async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        const hashedPassword = await getUserHashedPassword(req.user.id);
        const isValid = await comparePasswords(currentPassword, hashedPassword);

        if (!isValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const newHashedPassword = await hashPassword(newPassword);
        await changeUserPassword(req.user.id, newHashedPassword);
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Error changing user password:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
}

/**
 * Delete user account.
 */
export async function deleteAccount(req, res) {
    try {
        const { currentPassword } = req.body;

        const hashedPassword = await getUserHashedPassword(req.user.id);
        const isValid = await comparePasswords(currentPassword, hashedPassword);

        if (!isValid) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        await deleteUser(req.user.id);
        res.json({ message: "User account deleted" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: err.message || "Server error" });
    }
}
