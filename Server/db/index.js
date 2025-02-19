const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: 'auto-service-helper',
    port: process.env.DB_PORT
});

module.exports = {pool};