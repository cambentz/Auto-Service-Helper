const express = require('express');
const router = express.Router();

const guideQueries = require('../db/guideQueries.js');

router.get('/', async (req, res) => {
    let guides = await guideQueries.getAllGuides();

    if (!guides || guides.length === 0) {
        return res.status(404).json({ error: 'No guides found.'});
    }

    res.json(guides);
});

module.exports = router;
