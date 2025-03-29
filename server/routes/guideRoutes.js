/**
 * Routes for guides and steps.
 */
import express from "express";
import {
    getAllGuides,
    getGuideById,
    createGuide,
    deleteGuide,
    updateGuide,
    getSteps,
    createStep,
    deleteStep,
    updateStep,
    getGuideVehicles,
} from "../controllers/guideController.js";

const router = express.Router();

/**
 * @route GET /api/guides
 * @desc Fetch all guides, optionally sorted or filtered
 * @access Public
 */
router.get("/", getAllGuides);

/**
 * @route GET /api/guides/:id
 * @desc Fetch a single guide by ID
 * @access Public
 */
router.get("/:id", getGuideById);

/**
 * @route POST /api/guides
 * @desc Create a new guide
 * @access Public
 */
router.post("/", createGuide);

/**
 * @route DELETE /api/guides/:id
 * @desc Delete a guide by ID
 * @access Public
 */
router.delete("/:id", deleteGuide);

/**
 * @route PUT /api/guides/:id
 * @desc Update a guide by ID
 * @access Public
 */
router.put("/:id", updateGuide);

/**
 * @route GET /api/guides/:id/steps
 * @desc Fetch all steps for a specific guide
 * @access Public
 */
router.get("/:id/steps", getSteps);

/**
 * @route POST /api/guides/:id/steps
 * @desc Add a new step to a guide
 * @access Public
 */
router.post("/:id/steps", createStep);

/**
 * @route DELETE /api/guides/:id/steps/:stepNum
 * @desc Delete a specific step from a guide
 * @access Public
 */
router.delete("/:id/steps/:stepNum", deleteStep);

/**
 * @route PUT /api/guides/:id/steps/:stepNum
 * @desc Update a specific step of a guide
 * @access Public
 */
router.put("/:id/steps/:stepNum", updateStep);

/**
 * @route GET /api/guides/:id/vehicles
 * @desc Fetch all vehicles associated with a guide
 * @access Public
 */
router.get("/:id/vehicles", getGuideVehicles);

export default router;
