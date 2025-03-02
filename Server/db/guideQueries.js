const { pool } = require('./index.js');

/*
    * @param {Object} [opts] options to be used for filtering
    * @param {string} [opts.q] search keyword
    * @param {('asc'|'desc')} [opts.sort] how results should be ordered (by name)
*/
async function getAllGuides(opts) {
    let query = 'SELECT * FROM GUIDES';
    let values = [];

    if (opts.q) {
        values.push('%' + opts.q + '%');
        query += ` WHERE name ILIKE $${values.length}`;
    }
    if (opts.sort) {
        if (opts.sort === 'asc') query += ' ORDER BY name ASC';
        else if (opts.sort === 'desc') query += ' ORDER BY name DESC';
    }

    try {
        let result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function getGuideById(id) {
    const query = "SELECT * FROM guides WHERE guide_id = $1";
    try {
        let result = await pool.query(query, [id]);
        return result.rows[0];
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

async function deleteGuide(id) {
    const query = "DELETE FROM guides WHERE guide_id = $1 RETURNING *";
    try {
        let result = await pool.query(query, [id]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function updateGuide(id, name, description, thumbnail) {
    const query = "UPDATE guides SET name = $1, description = $2, thumbnail = $3 WHERE guide_id = $4 RETURNING *";
    try {
        let result = await pool.query(query, [name, description, thumbnail, id]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function getStep(guideId, stepNum) {
    const query = "SELECT * FROM steps WHERE guide_id = $1 AND step_num = $2";
    try {
        let result = await pool.query(query, [guideId, stepNum]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function getSteps(guideId) {
    const query = "SELECT * FROM steps WHERE guide_id = $1 ORDER BY step_num ASC";
    try {
        let result = await pool.query(query, [guideId]);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function createStep(guideId, stepNum, description, media) {
    const query = "INSERT INTO steps (guide_id, step_num, description, media) VALUES ($1, $2, $3, $4) RETURNING *";
    try {
        let result = await pool.query(query, [guideId, stepNum, description, media]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function deleteStep(guideId, stepNum) {
    const query = "DELETE FROM steps WHERE guide_id = $1 AND step_num = $2 RETURNING *";
    try {
        let result = await pool.query(query, [guideId, stepNum]);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function updateStep(guideId, stepNum, newStepNum, description, media) {
    const query = "UPDATE steps SET step_num = $1, description = $2, media = $3 WHERE guide_id = $4 AND step_num = $5 RETURNING *";
    try {
        let result = await pool.query(query, [newStepNum, description, media, guideId, stepNum]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = { getAllGuides, createGuide, getGuideById, getStep, getSteps, createStep, deleteGuide, deleteStep, updateGuide, updateStep }
