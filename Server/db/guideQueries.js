const { pool } = require('./index.js');

async function getAllGuides() {
    const query = "SELECT * FROM guides";
    try {
        let result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function createGuide(name, description, thumbnail) {
    const query = "INSERT INTO guides (name, description, thumbnail) VALUES ($1, $2, $3) RETURNING *";
    try {
        let result = await pool.query(query, [name, description, thumbnail]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = { getAllGuides, createGuide }
