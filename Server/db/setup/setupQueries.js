const pg = require('pg');
const { Pool, Client } = pg;

require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: 'auto-service-helper',
    port: process.env.DB_PORT
});

let tableQueries = [];
tableQueries.push(`
            CREATE TABLE IF NOT EXISTS guide (
                guide_id SERIAL PRIMARY KEY,
                name TEXT,
                description TEXT,
                thumbnail TEXT
            )
`);

tableQueries.push(`
            CREATE TABLE IF NOT EXISTS step (
                step_id SERIAL PRIMARY KEY,
                step_num INT,
                description TEXT,
                image TEXT
            )
`);

tableQueries.push(`
            CREATE TABLE IF NOT EXISTS role (
                role_id SERIAL PRIMARY KEY,
                role_name TEXT
            )
`);

tableQueries.push(`
            CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT,
                password_hash TEXT,
                role_id INT REFERENCES role
            )
`);

tableQueries.push(`
            CREATE TABLE IF NOT EXISTS has_favorited (
                user_id INT REFERENCES users,
                guide_id INT REFERENCES guide,

                PRIMARY KEY (user_id, guide_id)
            )
`);

async function createAllTables() {
    const client = await pool.connect()

    try {
        await client.query('BEGIN')
        for (let query of tableQueries) {
            const res = await client.query(query);
        }
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

async function deleteAllTables() {
    const client = await pool.connect()
    try {
        await client.query('DROP TABLE IF EXISTS has_favorited');
        await client.query('DROP TABLE IF EXISTS guide');
        await client.query('DROP TABLE IF EXISTS step');
        await client.query('DROP TABLE IF EXISTS users');
        await client.query('DROP TABLE IF EXISTS owns');
        await client.query('DROP TABLE IF EXISTS vehicle');
        await client.query('DROP TABLE IF EXISTS role');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

async function createDatabase() {
    // you need to connect to the postgres db first before making a new one
    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: 'postgres',
        port: process.env.DB_PORT
    });

    await client.connect();
    // check if 'auto-service-helper' database exists
    let result = await client.query("SELECT 1 FROM pg_catalog.pg_database WHERE datname = 'auto-service-helper'");
    if (result.rows.length < 1) {
        const query = `
        CREATE DATABASE "auto-service-helper"
            WITH
            OWNER = postgres
            ENCODING = 'UTF8'
            LC_COLLATE = 'English_United States.1252'
            LC_CTYPE = 'English_United States.1252'
            LOCALE_PROVIDER = 'libc'
            TABLESPACE = pg_default
            CONNECTION LIMIT = -1
            IS_TEMPLATE = False;
        `;
        try {
            await client.query(query);
        } catch (e) {
            throw e;
        }
    }
    await client.end();
}

async function endPool() {
    try {
        await pool.end();
    } catch (e) {
        throw e;
    }
}

module.exports = {createAllTables, deleteAllTables, createDatabase, endPool};