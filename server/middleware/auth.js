import dotenv from "dotenv";
dotenv.config();

import { verifyToken } from "../utils/jwt.js";

/**
 * Middleware to authenticate JWT tokens.
 * Extracts token from the Authorization header, verifies it, and attaches user data to the request.
 */
export const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};