/**
 * Routes for garages.
 */
import express from "express";
import {
    getVehicles,
    addVehicle,
    deleteVehicle
} from "../controllers/garageController.js";

const router = express.Router();

/**
 * @route GET /api/garage/:id
 * @desc Fetch all vehicles in a user's garage
 * @access Public
 */
router.get("/:id", getVehicles);

/**
 * @route POST /api/garage/:id
 * @desc Add a vehicle to a user's garage by ID or model and year
 * @access Public
 */
router.post("/:id", addVehicle);

/**
 * @route DELETE /api/garage/:id
 * @desc Delete a vehicle from a user's garage
 * @access Public
 */
router.delete("/:id", deleteVehicle);

export default router;
