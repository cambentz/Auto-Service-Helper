import jwt from "jsonwebtoken";

/**
 * Generates a JWT token from the given payload.
 * @param {Object} payload - Data to encode in the token (e.g., user ID, role).
 * @param {string} [expiresIn="1h"] - Optional expiration time for the token.
 * @returns {string} - Signed JWT token.
 */
export const generateToken = (payload, expiresIn = "1h") => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify.
 * @returns {Object} - Decoded token payload.
 * @throws {Error} - If the token is invalid or expired.
 */
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};