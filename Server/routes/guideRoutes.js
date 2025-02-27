const express = require('express');
const router = express.Router();

const guideQueries = require('../db/guideQueries.js');

router.get('/', async (req, res) => {
    let guides = await guideQueries.getAllGuides();

    if (!guides || guides.length === 0) {
        return res.status(404).json({ error: 'No guides found'});
    }

    res.json(guides);
});

router.post('/', async (req, res) => {
    const { name, description, thumbnail } = req.body;

    if (!name || !name.trim()) return res.status(400).json({ error: 'Name not provided'});

    let result = await guideQueries.createGuide(name, description, thumbnail);
    if (result) {
        return res.json(result);
    }
    else {
        return res.status(500).json({ error: 'Error creating guide'})
    }
});

module.exports = router;
