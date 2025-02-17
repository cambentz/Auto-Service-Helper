const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'auto-service-helper',
    port: 5432
});

module.exports = {pool};