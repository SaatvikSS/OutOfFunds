const express = require('express');
const router = express.Router();
const GeminiService = require('../services/geminiService');
const geminiService = new GeminiService();

router.post('/universities', async (req, res) => {
    try {
        console.log('University search request:', req.body);
        const result = await geminiService.generateUniversityResults(req.body);
        console.log('University search response:', result);
        res.json(result);
    } catch (error) {
        console.error('Error searching universities:', error);
        res.status(500).json({ 
            error: 'Failed to fetch universities',
            details: error.message 
        });
    }
});

router.post('/jobs', async (req, res) => {
    try {
        console.log('Job search request:', req.body);
        const result = await geminiService.generateJobResults(req.body);
        console.log('Job search response:', result);
        res.json(result);
    } catch (error) {
        console.error('Error searching jobs:', error);
        res.status(500).json({ 
            error: 'Failed to fetch jobs',
            details: error.message 
        });
    }
});

router.post('/accommodation', async (req, res) => {
    try {
        console.log('Accommodation search request:', req.body);
        const result = await geminiService.generateAccommodationResults(req.body);
        console.log('Accommodation search response:', result);
        res.json(result);
    } catch (error) {
        console.error('Error searching accommodation:', error);
        res.status(500).json({ 
            error: 'Failed to fetch accommodation',
            details: error.message 
        });
    }
});

module.exports = router;
