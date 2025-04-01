import {
    getVehicles as getVehiclesQuery,
    addVehicle as addVehicleQuery,
    addVehicleByModel as addVehicleByModelQuery,
    deleteVehicle as deleteVehicleQuery
} from "../db/garageQueries.js";

/**
 * GET the vehicles in a user's garage by user ID
 */
export async function getVehicles(req, res) {
    const { id } = req.params;
    if (!parseInt(id)) return res.status(400).json({ error: "Invalid user ID" });

    const result = await getVehiclesQuery(id);
    if (!result) return res.status(404).json({ error: "No vehicles found" });

    res.json(result);
}

/**
 * POST a new vehicle to a user's garage by vehicle ID or by model ID and year
 */
export async function addVehicle(req, res) {
    const { id } = req.params;
    const { vehicleId, modelId, year } = req.body;
    let result;

    if (!parseInt(id)) return res.status(400).json({ error: "Invalid user ID" });

    if (vehicleId) {
        if (!parseInt(vehicleId)) return res.status(400).json({ error: "Invalid vehicle ID" });
        result = await addVehicleQuery(id, vehicleId);
    }
    else {
        if (!modelId || !parseInt(modelId)) return res.status(400).json({ error: "Invalid model ID" });
        if (!year || !parseInt(year)) return res.status(400).json({ error: "Invalid year" });
        result = await addVehicleByModelQuery(id, modelId, year);
    }

    if (result) res.json(result);
    else res.status(500).json({ error: "Error adding vehicle" });
}

/**
 * DELETE a vehicle from a user's garage
 */
export async function deleteVehicle(req, res) {
    const { id } = req.params;
    const { vehicleId } = req.body
    if (!parseInt(id)) return res.status(400).json({ error: "Invalid guide ID" });
    if (!vehicleId || !parseInt(vehicleId)) return res.status(400).json({ error: "Invalid vehicle ID" });

    const result = await deleteVehicleQuery(id, vehicleId);
    if (result) res.json(result);
    else res.status(500).json({ error: "Error deleting vehicle" });
}
