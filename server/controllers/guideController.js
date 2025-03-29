/**
 *  Functions for guide and step management.
 */
import {
    getAllGuides as getAllGuidesQuery,
    getGuideById as getGuideByIdQuery,
    createGuide as createGuideQuery,
    deleteGuide as deleteGuideQuery,
    updateGuide as updateGuideQuery,
    getSteps as getStepsQuery,
    getStep as getStepQuery,
    createStep as createStepQuery,
    deleteStep as deleteStepQuery,
    updateStep as updateStepQuery,
    getGuideVehicles as getGuideVehiclesQuery,
} from "../db/guideQueries.js";

/**
 * GET all guides. Supports optional sorting and search query.
 */
export async function getAllGuides(req, res) {
    let { sort } = req.query;
    let opts = { sort: null, q: req.query.q };
    const validSorts = ["asc", "desc"];

    try {
        if (sort) {
            if (!validSorts.includes(sort)) return res.status(400).json({ error: "Invalid sort query" });
            opts.sort = sort;
        }

        const guides = await getAllGuidesQuery(opts);
        if (!guides || guides.length === 0) return res.status(404).json({ error: "No guides found" });

        res.json(guides);
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
}

/**
 * GET a single guide by ID.
 */
export async function getGuideById(req, res) {
    const { id } = req.params;
    if (!parseInt(id)) return res.status(400).json({ error: "Invalid guide ID" });

    const guide = await getGuideByIdQuery(id);
    if (!guide) return res.status(404).json({ error: "No guides found" });

    res.json(guide);
}

/**
 * POST a new guide.
 */
export async function createGuide(req, res) {
    const { name, description, thumbnail } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: "Invalid name" });

    const result = await createGuideQuery(name, description, thumbnail);
    if (result) res.json(result);
    else res.status(500).json({ error: "Error creating guide" });
}

/**
 * DELETE a guide by ID.
 */
export async function deleteGuide(req, res) {
    const { id } = req.params;
    if (!parseInt(id)) return res.status(400).json({ error: "Invalid guide ID" });

    const result = await deleteGuideQuery(id);
    if (result) res.json(result);
    else res.status(500).json({ error: "Error deleting guide" });
}

/**
 * PUT to update a guide by ID.
 */
export async function updateGuide(req, res) {
    const { id } = req.params;
    const { name, description, thumbnail } = req.body;

    // param validation
    if (!parseInt(id)) return res.status(400).json({ error: "Invalid guide ID" });

    const oldGuide = await getGuideByIdQuery(id);
    if (!oldGuide) return res.status(400).json({ error: "Guide does not exist" });

    // body validation
    if (name || name === "") {
        if (!name.trim()) return res.status(400).json({ error: "Invalid name" });
    }

    // replace any unprovided arguments with the current values
    const result = await updateGuideQuery(
        id,
        name ?? oldGuide.name,
        description ?? oldGuide.description,
        thumbnail ?? oldGuide.thumbnail
    );
    if (result) res.json(result);
    else res.status(500).json({ error: "Error updating guide" });
}

/**
 * GET all steps for a guide.
 */
export async function getSteps(req, res) {
    const { id } = req.params;
    if (!parseInt(id)) return res.status(400).json({ error: "Invalid guide ID" });

    const steps = await getStepsQuery(id);
    if (!steps || steps.length === 0)
        return res.status(404).json({ error: "No steps found" });

    res.json(steps);
}

/**
 * POST a new step to a guide.
 */
export async function createStep(req, res) {
    const { id } = req.params;
    const { stepNum, description, media } = req.body;

    // param validation
    if (!parseInt(id)) return res.status(400).json({ error: "Invalid guide ID" });

    // body validation
    if (!stepNum || !parseInt(stepNum) || stepNum < 1) return res.status(400).json({ error: "Invalid step number" });
    if (!description || !description.trim()) return res.status(400).json({ error: "Invalid description" });

    // check for duplicate
    const checkStep = await getStepQuery(id, stepNum);
    if (checkStep) return res.status(400).json({ error: `Guide already has step number ${stepNum}` });

    const result = await createStepQuery(id, stepNum, description, media);
    if (result) res.json(result);
    else res.status(500).json({ error: "Error creating step" });
}

/**
 * DELETE a step from a guide.
 */
export async function deleteStep(req, res) {
    const { id, stepNum } = req.params;

    // param validation
    if (!parseInt(id)) return res.status(400).json({ error: "Invalid guide ID" });
    if (!parseInt(stepNum) || stepNum < 1) return res.status(400).json({ error: "Invalid step number" });

    // check if step exists
    const checkStep = await getStepQuery(id, stepNum);
    if (!checkStep) return res.status(400).json({ error: "Step not found." });

    const result = await deleteStepQuery(id, stepNum);
    if (result) res.json(result);
    else res.status(500).json({ error: "Error deleting guide" });
}

/**
 * PUT to update a step in a guide.
 */
export async function updateStep(req, res) {
    const { id, stepNum } = req.params;
    const { description, media } = req.body;
    const newStepNum = req.body.stepNum;

    // param validation
    if (!parseInt(id)) return res.status(400).json({ error: "Invalid guide ID" });
    if (!parseInt(stepNum) || stepNum < 1) return res.status(400).json({ error: "Invalid step number" });

    // check if step exists
    const oldStep = await getStepQuery(id, stepNum);
    if (!oldStep) return res.status(400).json({ error: "Step not found." });

    // body validation
    if (description || description === "") {
        if (!description.trim()) return res.status(400).json({ error: "Invalid description" });
    }

    if (newStepNum < 1) return res.status(400).json({ error: "Invalid step number" });

    // I hate javascript
    if (newStepNum || newStepNum === "") {
        if (!parseInt(newStepNum)) return res.status(400).json({ error: "Invalid step number" });

        // check for duplicate
        const checkStep = await getStepQuery(id, newStepNum);
        if (checkStep) return res.status(400).json({ error: `Guide already has step number ${newStepNum}` });
    }

    const result = await updateStepQuery(
        id,
        stepNum,
        newStepNum ?? oldStep.step_num,
        description || oldStep.description,
        media ?? oldStep.media
    );
    if (result) res.json(result);
    else res.status(500).json({ error: "Error updating step" });
}

/*
 * GET all vehicles associated with a guide. Returns vehicle id, year, make, and model.
*/
export async function getGuideVehicles(req, res) {
    const { id } = req.params;
    if (!parseInt(id)) return res.status(400).json({ error: "Invalid guide ID" });

    const vehicles = await getGuideVehiclesQuery(id);
    if (!vehicles || vehicles.length < 1) return res.status(404).json({ error: "No vehicles found" });

    res.json(vehicles);
}
