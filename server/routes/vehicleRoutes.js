/**
 * Routes for vehicles.
 */
import express from "express";
import {
    getMakes,
    getModels
} from "../controllers/vehicleController.js";

const router = express.Router();

/**
 * @route GET /api/vehicles
 * @desc Get all vehicle makes
 * @access Public
 */
router.get("/makes", getMakes);

/**
 * @route POST /api/vehicles/:makeId
 * @desc Get all vehicle models for vehicle maker
 * @access Public
 */
router.get("/makes/:makeId", getModels);

export default router;
