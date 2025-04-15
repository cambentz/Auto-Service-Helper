import dotenv from "dotenv";
import app from "./app.js";
import { pool } from './db/index.js';

dotenv.config();

const PORT = process.env.PORT || 3000;


const confirmDbConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log(`Connected to Supabase DB at: ${result.rows[0].now}`);
    } catch (err) {
        console.error('Failed to connect to Supabase DB:', err.message);
    }
};

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    confirmDbConnection();
});

// Global error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at: ', promise, 'reason: ', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception: ', err);
});

