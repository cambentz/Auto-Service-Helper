const pg = require('pg');
const { Pool } = pg;

require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 10000
});

module.exports = {pool};
