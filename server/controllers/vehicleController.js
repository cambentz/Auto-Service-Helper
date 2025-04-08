import {
    getMakes as getMakesQuery,
    getModels as getModelsQuery
} from "../db/vehicleQueries.js";

/**
 * GET all vehicle makes
 */
export async function getMakes(req, res) {
    const result = await getMakesQuery();
    if (!result) return res.status(404).json({ error: "No makes found" });

    res.json(result);
}

/**
 * GET all vehicle models
 */
export async function getModels(req, res) {
    const { makeId } = req.params;
    const result = await getModelsQuery(makeId);
    if (!result) return res.status(404).json({ error: "No models found" });

    res.json(result);
}
