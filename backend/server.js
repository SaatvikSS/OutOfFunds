// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const geminiService = require('./services/geminiService');

// Verify environment variables
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3002;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        environment: {
            hasGeminiKey: !!process.env.GEMINI_API_KEY
        }
    });
});

// Search endpoints
app.post('/api/search/universities', async (req, res) => {
    try {
        console.log('Received university search request:', req.body);
        const results = await geminiService.generateUniversityResults(req.body);
        console.log('Sending university results:', results);
        res.json(results);
    } catch (error) {
        console.error('Error in university search:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message,
            universities: [] 
        });
    }
});

app.post('/api/search/jobs', async (req, res) => {
    try {
        console.log('Received job search request:', req.body);
        const results = await geminiService.generateJobResults(req.body);
        console.log('Sending job results:', results);
        res.json(results);
    } catch (error) {
        console.error('Error in job search:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message,
            jobs: [] 
        });
    }
});

app.post('/api/search/accommodation', async (req, res) => {
    try {
        console.log('Received accommodation search request:', req.body);
        const results = await geminiService.generateAccommodationResults(req.body);
        console.log('Sending accommodation results:', results);
        res.json(results);
    } catch (error) {
        console.error('Error in accommodation search:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message,
            accommodations: [] 
        });
    }
});

// Main recommendations endpoint
app.post('/api/search/recommendations', async (req, res) => {
    try {
        console.log('Received search request:', req.body);
        const results = await geminiService.generateResults(req.body);
        console.log('Sending results:', results);
        res.json(results);
    } catch (error) {
        console.error('Error in recommendations search:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error.message,
            universities: [],
            jobs: [],
            accommodations: []
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Environment:', {
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        nodeEnv: process.env.NODE_ENV
    });
});
