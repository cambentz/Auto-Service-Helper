/**
 * Controller functions for user authentication.
 */
import { registerUser, getUserByEmail } from "../db/authQueries.js";
import { hashPassword, comparePasswords } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";


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