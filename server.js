import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import searchRoutes from './backend/src/routes/searchRoutes.js';

// Load environment variables
dotenv.config();

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Serve static files from frontend directory
app.use(express.static('frontend'));

// API Routes
app.use('/api', searchRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    if (!process.env.GEMINI_API_KEY) {
        console.error('Warning: GEMINI_API_KEY is not set in .env file');
    }
    console.log(`Server running at http://localhost:${PORT}`);
});
