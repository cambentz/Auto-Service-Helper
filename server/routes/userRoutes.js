import express from "express";
import {
    getProfile,
    updateProfile,
    changePassword,
    deleteAccount,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route GET /api/users/profile
 * @desc Get the authenticated user's profile
 * @access Private
 */
router.get("/profile", authenticateToken, getProfile);

/**
 * @route PUT /api/users/profile
 * @desc Update the authenticated user's profile
 * @access Private
 */
router.put("/profile", authenticateToken, updateProfile);

/**
 * @route PUT /api/users/change-password
 * @desc Change the authenticated user's password
 * @access Private
 */
router.put("/change-password", authenticateToken, changePassword);

/**
 * @route DELETE /api/users/delete
 * @desc Delete the authenticated user's account
 * @access Private
 */
router.delete("/delete", authenticateToken, deleteAccount);

export default router;