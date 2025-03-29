import { pool } from './index.js';

/**
 * Retrieve all guides, optionally filtered by keyword and sorted.
 * @param {Object} opts
 * @param {string} [opts.q] Search keyword for guide names.
 * @param {"asc"|"desc"} [opts.sort] Sorting direction by name.
 * @returns {Promise<Array|false>} List of guides or false on error.
 */
export const getAllGuides = async (opts) => {
    let query = 'SELECT * FROM guides';
    const values = [];

    if (opts.q) {
        values.push(`%${opts.q}%`);
        query += ` WHERE name ILIKE $${values.length}`;
    }

    if (opts.sort) {
        if (opts.sort === 'asc') query += ' ORDER BY name ASC';
        else if (opts.sort === 'desc') query += ' ORDER BY name DESC';
    }

    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Retrieve a guide by its ID.
 * @param {number} id - Guide ID.
 * @returns {Promise<Object|false>} Guide object or false on error.
 */
export const getGuideById = async (id) => {
    const query = 'SELECT * FROM guides WHERE guide_id = $1';
    try {
        const result = await pool.query(query, [id]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Create a new guide.
 * @param {string} name - Guide name.
 * @param {string} description - Guide description.
 * @param {string} thumbnail - Guide thumbnail URL.
 * @returns {Promise<Object|false>} Newly created guide or false on error.
 */
export const createGuide = async (name, description, thumbnail) => {
    const query = 'INSERT INTO guides (name, description, thumbnail) VALUES ($1, $2, $3) RETURNING *';
    try {
        const result = await pool.query(query, [name, description, thumbnail]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Delete a guide by ID.
 * @param {number} id - Guide ID.
 * @returns {Promise<Object|false>} Deleted guide or false on error.
 */
export const deleteGuide = async (id) => {
    const query = 'DELETE FROM guides WHERE guide_id = $1 RETURNING *';
    try {
        const result = await pool.query(query, [id]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Update an existing guide.
 * @param {number} id - Guide ID.
 * @param {string} name - New name.
 * @param {string} description - New description.
 * @param {string} thumbnail - New thumbnail URL.
 * @returns {Promise<Object|false>} Updated guide or false on error.
 */
export const updateGuide = async (id, name, description, thumbnail) => {
    const query = `
      UPDATE guides
      SET name = $1, description = $2, thumbnail = $3
      WHERE guide_id = $4
      RETURNING *`;
    try {
        const result = await pool.query(query, [name, description, thumbnail, id]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Retrieve a specific step by guide ID and step number.
 * @param {number} guideId - Guide ID.
 * @param {number} stepNum - Step number.
 * @returns {Promise<Object|false>} Step object or false on error.
 */
export const getStep = async (guideId, stepNum) => {
    const query = 'SELECT * FROM steps WHERE guide_id = $1 AND step_num = $2';
    try {
        const result = await pool.query(query, [guideId, stepNum]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Retrieve all steps for a guide.
 * @param {number} guideId - Guide ID.
 * @returns {Promise<Array|false>} List of steps or false on error.
 */
export const getSteps = async (guideId) => {
    const query = 'SELECT * FROM steps WHERE guide_id = $1 ORDER BY step_num ASC';
    try {
        const result = await pool.query(query, [guideId]);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Create a step for a guide.
 * @param {number} guideId - Guide ID.
 * @param {number} stepNum - Step number.
 * @param {string} description - Step description.
 * @param {string} media - Optional media URL.
 * @returns {Promise<Object|false>} Newly created step or false on error.
 */
export const createStep = async (guideId, stepNum, description, media) => {
    const query = `
      INSERT INTO steps (guide_id, step_num, description, media)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
    try {
        const result = await pool.query(query, [guideId, stepNum, description, media]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Delete a step by guide ID and step number.
 * @param {number} guideId - Guide ID.
 * @param {number} stepNum - Step number.
 * @returns {Promise<Object|false>} Deleted step or false on error.
 */
export const deleteStep = async (guideId, stepNum) => {
    const query = 'DELETE FROM steps WHERE guide_id = $1 AND step_num = $2 RETURNING *';
    try {
        const result = await pool.query(query, [guideId, stepNum]);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Update a step in a guide.
 * @param {number} guideId - Guide ID.
 * @param {number} stepNum - Step number to update.
 * @param {number} newStepNum - New step number.
 * @param {string} description - New description.
 * @param {string} media - New media URL.
 * @returns {Promise<Object|false>} Updated step or false on error.
 */
export const updateStep = async (guideId, stepNum, newStepNum, description, media) => {
    const query = `
      UPDATE steps
      SET step_num = $1, description = $2, media = $3
      WHERE guide_id = $4 AND step_num = $5
      RETURNING *`;
    try {
        const result = await pool.query(query, [newStepNum, description, media, guideId, stepNum]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Retrieve all vehicles for a guide along with the vehicle information
 * @param {id} ID of the guide
 * @returns {Promise<Array|false>} List of vehicles or false on error.
 */
export const getGuideVehicles = async (id) => {
    const query = `
    WITH vehicle_complete AS (
        SELECT vehicles.id AS id, year, models.name AS model, makes.name AS make
        FROM vehicles
        JOIN models ON vehicles.model_id = models.id
        JOIN makes ON models.make_id = makes.id
    )
    SELECT id, year, model, make FROM guide_vehicles
    JOIN vehicle_complete ON (guide_vehicles.vehicle_id = vehicle_complete.id)
    WHERE guide_id = $1
    `;
    try {
        const result = await pool.query(query, [id]);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Associate a guide with a vehicle
 * @param {number} guideId - Guide ID.
 * @param {number} vehicleId - Vehicle ID.
 * @returns {Promise<Object|false>} New entry or false on error.
 */
export const addGuideVehicle = async (guideId, vehicleId) => {
    const query = `
    INSERT INTO guide_vehicles (guide_id, vehicle_id)
    VALUES ($1, $2)
    RETURNING *
    `
    try {
        const result = await pool.query(query, [guideId, vehicleId]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
};

/**
 * Deletes a guide/vehicle association
 * @param {number} guideId - Guide ID.
 * @param {number} vehicleId - Vehicle ID.
 * @returns {Promise<Object|false>} Deleted entry or false on error.
 */
export const deleteGuideVehicle = async (guideId, vehicleId) => {
    const query = 'DELETE FROM guide_vehicles WHERE guide_id = $1 AND vehicle_id = $2 RETURNING *';
    try {
        const result = await pool.query(query, [guideId, vehicleId]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
};
