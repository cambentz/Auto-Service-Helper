/**
 * Routes for user authentication.
 */
import express from "express";
import {
    register,
    loginUser,
    resetPassword,
    requestPasswordReset
} from "../controllers/authController.js";

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", register);

/**
 * @route POST /api/auth/login
 * @desc Login a user and return JWT
 * @access Public
 */
router.post("/login", loginUser);

/**
 * @route POST /api/auth/reset-password-reset
 * @desc Reset a password for an existing account
 * @access Public
 */
router.post('/request-password-reset', requestPasswordReset);

export default router;