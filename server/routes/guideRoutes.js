const express = require('express');
const router = express.Router();

const guideQueries = require('../db/guideQueries.js');

router.get('/', async (req, res) => {
    let { sort } = req.query;

    let guides;
    let opts = { sort: null, q: req.query['q'] };

    let validSorts = ['asc', 'desc'];
    if (sort) {
        if (validSorts.includes(sort)) opts.sort = sort;
        else return res.status(400).json({ error: 'Invalid sort query'})
    }

    guides = await guideQueries.getAllGuides(opts);

    if (!guides || guides.length === 0) {
        return res.status(404).json({ error: 'No guides found'});
    }

    res.json(guides);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!parseInt(id)) return res.status(400).json({ error: 'Invalid guide ID'});

    let guides = await guideQueries.getGuideById(id);

    if (!guides) {
        return res.status(404).json({ error: 'No guides found'});
    }

    res.json(guides);
});

router.post('/', async (req, res) => {
    const { name, description, thumbnail } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Invalid name'});

    let result = await guideQueries.createGuide(name, description, thumbnail);
    if (result) {
        return res.json(result);
    }
    else {
        return res.status(500).json({ error: 'Error creating guide'})
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    if (!parseInt(id)) return res.status(400).json({ error: 'Invalid guide ID'});

    let result = await guideQueries.deleteGuide(id);
    if (result) {
        return res.json(result);
    }
    else {
        return res.status(500).json({ error: 'Error deleting guide'})
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, thumbnail } = req.body;

    // param validation
    if (!parseInt(id)) return res.status(400).json({ error: 'Invalid guide ID'});

    let oldGuide = await guideQueries.getGuideById(id);

    if (!oldGuide) {
        return res.status(400).json({ error: 'Guide does not exist'});
    }

    // body validation
    if (name || name === "") {
        if (!name.trim()) return res.status(400).json({ error: 'Invalid name'});
    }

    // replace any unprovided arguments with the current values
    let result = await guideQueries.updateGuide(id, name ?? oldGuide.name, description ?? oldGuide.description, thumbnail ?? oldGuide.thumbnail);
    if (result) {
        return res.json(result);
    }
    else {
        return res.status(500).json({ error: 'Error updating guide'})
    }
});

router.get('/:id/steps', async (req, res) => {
    const { id } = req.params;

    if (!parseInt(id)) return res.status(400).json({ error: 'Invalid guide ID'});

    let steps = await guideQueries.getSteps(id);

    if (!steps || steps.length === 0) {
        return res.status(404).json({ error: 'No steps found'});
    }

    res.json(steps);
});

router.post('/:id/steps', async (req, res) => {
    const { id } = req.params;
    const { stepNum, description, media } = req.body;

    // param validation
    if (!parseInt(id)) return res.status(400).json({ error: 'Invalid guide ID'});

    // body validation
    if (!stepNum || !parseInt(stepNum) || stepNum < 1) return res.status(400).json({ error: 'Invalid step number'});
    if (!description || !description.trim()) return res.status(400).json({ error: 'Invalid description'});

    // check for duplicate
    let checkStep = await guideQueries.getStep(id, stepNum);
    if (checkStep) {
        return res.status(400).json({ error: 'Guide already has step number ' + stepNum});
    }

    let result = await guideQueries.createStep(id, stepNum, description, media);
    if (result) {
        return res.json(result);
    }
    else {
        return res.status(500).json({ error: 'Error creating step'})
    }
});

router.delete('/:id/steps/:stepNum', async (req, res) => {
    const { id, stepNum } = req.params;

    // param validation
    if (!parseInt(id)) return res.status(400).json({ error: 'Invalid guide ID'});
    if (!parseInt(stepNum) || stepNum < 1) return res.status(400).json({ error: 'Invalid step number'});

    // check if step exists
    let checkStep = await guideQueries.getStep(id, stepNum);
    if (!checkStep) {
        return res.status(400).json({ error: 'Step not found.'});
    }

    let result = await guideQueries.deleteStep(id, stepNum);
    if (result) {
        return res.json(result);
    }
    else {
        return res.status(500).json({ error: 'Error deleting guide'})
    }
});

router.put('/:id/steps/:stepNum', async (req, res) => {
    const { id, stepNum } = req.params;
    const { description, media } = req.body;
    const newStepNum = req.body.stepNum;

    // param validation
    if (!parseInt(id)) return res.status(400).json({ error: 'Invalid guide ID'});
    if (!parseInt(stepNum) || stepNum < 1) return res.status(400).json({ error: 'Invalid step number'});

    // check if step exists
    let oldStep = await guideQueries.getStep(id, stepNum);
    if (!oldStep) {
        return res.status(400).json({ error: 'Step not found.'});
    }

    // body validation
    if (description || description === "") {
        if (!description.trim()) return res.status(400).json({ error: 'Invalid description'});
    };

    if (newStepNum < 1) return res.status(400).json({ error: 'Invalid step number'});

    // I hate javascript
    if (newStepNum || newStepNum === "") {
        if (!parseInt(newStepNum)) return res.status(400).json({ error: 'Invalid step number'});

        // check for duplicate
        let checkStep = await guideQueries.getStep(id, newStepNum);
        if (checkStep) {
            return res.status(400).json({ error: 'Guide already has step number ' + newStepNum});
        }
    }

    let result = await guideQueries.updateStep(id, stepNum, newStepNum ?? oldStep.step_num, description || oldStep.description, media ?? oldStep.media);
    if (result) {
        return res.json(result);
    }
    else {
        return res.status(500).json({ error: 'Error updating step'})
    }
});

module.exports = router;
