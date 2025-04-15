import { pool } from './index.js';

/**
 * Returns all vehicle makes
 * @returns {Promise<Array|false>} List of makes or false on error.
 */
export const getMakes = async () => {
    const query = 'SELECT id, name FROM makes';
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
}

/**
 * Returns all vehicle makes
 * @param {Number} [make_id] specified make ID
 * @returns {Promise<Array|false>} List of models or false on error.
 */
export const getModels = async (make_id) => {
    const query = 'SELECT id, name FROM models WHERE make_id = $1';
    try {
        const result = await pool.query(query, [make_id]);
        return result.rows;
    } catch (err) {
        console.error(err);
        return false;
    }
}
