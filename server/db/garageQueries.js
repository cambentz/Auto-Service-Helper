import { pool } from './index.js';

/**
 * Returns all vehicles in a user's garage
 * @param {Number} [userId] specified user ID
 * @returns {Promise<Array|false>} List of vehicles with details or false on error.
 */
export const getVehicles = async (userId) => {
    const query = `
    WITH vehicle_complete AS (
        SELECT vehicles.id AS id, year, models.name AS model, makes.name AS make
        FROM vehicles
        JOIN models ON vehicles.model_id = models.id
        JOIN makes ON models.make_id = makes.id
    )
    SELECT id, year, model, make FROM garage
    JOIN vehicle_complete ON (garage.vehicle_id = vehicle_complete.id)
    WHERE user_id = $1
    `;
    try {
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
}


/**
 * Add vehicle to a user's garage
 * @param {Number} [userId] specified user ID
 * @param {Number} [vehicleId] specified vehicle ID
 * @returns {Promise<Array|false>}  New entry or false on error.
 */
export const addVehicle = async (userId, vehicleId) => {
    const query = `
    INSERT INTO garage (user_id, vehicle_id)
    VALUES ($1, $2)
    RETURNING *
    `
    try {
        const result = await pool.query(query, [userId, vehicleId]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

/**
 * Add vehicle to a user's garage (by model and year)
 * @param {Number} [userId] specified user ID
 * @param {Number} [makeId] specified model ID
 * @param {Number} [year] specified year
 * @returns {Promise<Array|false>}  New entry or false on error.
 */
export const addVehicleByModel = async (userId, modelId, year) => {
    const query = `
    INSERT INTO garage (user_id, vehicle_id)
    (SELECT $1, id FROM vehicles
        WHERE model_id = $2 AND year = $3)
    RETURNING *
    `
    try {
        const result = await pool.query(query, [userId, modelId, year]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
}

/**
 * Remove a vehicle from a user's garage
 * @param {number} guideId - Guide ID.
 * @param {number} vehicleId - Vehicle ID.
 * @returns {Promise<Object|false>} Deleted guide or false on error.
 */
export const deleteVehicle = async (userId, vehicleId) => {
    const query = 'DELETE FROM garage WHERE user_id = $1 AND vehicle_id = $2 RETURNING *';
    try {
        const result = await pool.query(query, [userId, vehicleId]);
        return result.rows[0];
    } catch (err) {
        console.error(err);
        return false;
    }
};
