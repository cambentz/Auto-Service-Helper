import { hash, compare } from "bcryptjs";

/**
 * Hashes a plain-text password.
 * @param {string} password
 * @returns {Promise<string>}
 */
export const hashPassword = (password) => {
    return hash(password, 10);
};

/**
 * Compares a plain password against a hashed password.
 * @param {string} plain - Plain text password
 * @param {string} hashed - Hashed password from DB
 * @returns {Promise<boolean>}
 */
export const comparePasswords = (plain, hashed) => {
    return compare(plain, hashed);
};