const { pool } = require('./index.js');

async function getAllGuides() {
    const query = "SELECT * FROM guides";
    try {
        let res = await pool.query(query);
        return res.rows;
    } catch (e) {
        console.log(e);
    }
}

module.exports = { getAllGuides }
