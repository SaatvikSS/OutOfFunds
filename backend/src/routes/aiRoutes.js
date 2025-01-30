import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '../../.env') });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to generate AI response
async function generateAIResponse(prompt) {
    try {
        console.log('Generating AI response for prompt:', prompt);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        console.log('AI Response received:', response.text());
        return response.text();
    } catch (error) {
        console.error('AI Error:', error);
        if (error.status === 429) {
            throw new Error('Too many requests. Please wait a moment and try again.');
        }
        throw new Error('Failed to get AI recommendations. Please try again later.');
    }
}

// University recommendations
router.post('/universities', async (req, res) => {
    try {
        console.log('Received university request:', req.body);
        const { location, budget, studyLevel } = req.body;
        
        if (!location || !budget || !studyLevel) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: location, budget, and studyLevel'
            });
        }

        const prompt = `Act as an expert international education consultant. Provide detailed recommendations for 3 universities in ${location} that are suitable for ${studyLevel} students with a monthly budget of $${budget}.

For each university, provide a COMPREHENSIVE analysis with the following details:

1. Basic Information:
   - Full university name
   - Exact location (city, region, country)
   - Year established
   - Type (Public/Private)
   - QS World Ranking 2024
   - Student population

2. Academic Programs:
   - Available programs for ${studyLevel} level (list at least 5 popular programs)
   - Language of instruction
   - Program duration
   - Research opportunities
   - Faculty expertise

3. Costs Breakdown:
   - Annual tuition fees (exact range for different programs)
   - Monthly living expenses:
     * Accommodation
     * Food
     * Transportation
     * Books and supplies
     * Healthcare/insurance
     * Entertainment
   - One-time fees (application, visa, etc.)

4. Admission Requirements:
   - Academic prerequisites
   - Language requirements (IELTS/TOEFL scores)
   - Required documents
   - Application deadlines (all intakes)
   - Application process
   - Acceptance rate

5. Campus Facilities:
   - Student accommodation options
   - Libraries and study spaces
   - Sports facilities
   - Research centers
   - Student unions
   - Healthcare services

6. Student Support:
   - International student services
   - Career services
   - Academic support
   - Mental health support
   - Language support
   - Cultural integration programs

7. Notable Features:
   - Research strengths
   - Industry connections
   - International partnerships
   - Notable alumni
   - Unique selling points

8. Student Life:
   - Campus culture
   - Student clubs and societies
   - Local community
   - Weather and climate
   - Safety and security

9. Post-Graduation:
   - Employment rate
   - Career prospects
   - Alumni network
   - Post-study work visa options

Format each university's information clearly with proper headings and bullet points. Make sure to include SPECIFIC numbers, dates, and requirements where applicable.`;

        const response = await generateAIResponse(prompt);
        console.log('Sending university response to client');
        res.json({ status: 'success', response });

    } catch (error) {
        console.error('University recommendations error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get university recommendations'
        });
    }
});

// Part-time jobs
router.post('/jobs', async (req, res) => {
    try {
        console.log('Received jobs request:', req.body);
        const { location, budget, studyLevel } = req.body;
        
        if (!location || !budget || !studyLevel) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: location, budget, and studyLevel'
            });
        }

        const prompt = `Act as a career advisor for international students. Suggest 3 realistic part-time job opportunities in ${location} that can help a ${studyLevel} student earn up to $${budget} per month.

For each job opportunity, include:
1. Job title and type
2. Average hourly rate
3. Typical working hours
4. Required skills and experience
5. Popular employers
6. Work permit requirements
7. Application process
8. Tips for success

Format the response with clear headings and bullet points.`;

        const response = await generateAIResponse(prompt);
        console.log('Sending jobs response to client');
        res.json({ status: 'success', response });

    } catch (error) {
        console.error('Job recommendations error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get job recommendations'
        });
    }
});

// Accommodation advice
router.post('/accommodation', async (req, res) => {
    try {
        console.log('Received accommodation request:', req.body);
        const { location, budget, studyLevel } = req.body;
        
        if (!location || !budget || !studyLevel) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: location, budget, and studyLevel'
            });
        }

        const prompt = `Act as a housing advisor for international students. Provide accommodation advice for ${location} with a monthly budget of $${budget} for a ${studyLevel} student.

Include the following information:
1. Types of accommodation available:
   - University halls
   - Private student housing
   - Shared apartments
2. For each type:
   - Average monthly rent
   - Typical locations
   - Pros and cons
   - What's included
3. Popular student areas
4. Rental requirements and process
5. Additional costs to consider
6. Tips for finding accommodation
7. Reliable websites and resources
8. Safety and security advice

Format the response with clear headings and bullet points.`;

        const response = await generateAIResponse(prompt);
        console.log('Sending accommodation response to client');
        res.json({ status: 'success', response });

    } catch (error) {
        console.error('Accommodation advice error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get accommodation advice'
        });
    }
});

// Auto-search functionality
router.post('/auto-search', async (req, res) => {
    try {
        console.log('Received auto-search request:', req.body);
        const { location, budget, studyLevel } = req.body;
        
        if (!location || !budget || !studyLevel) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: location, budget, and studyLevel'
            });
        }

        const prompts = [
            `Act as an expert international education consultant. Provide detailed recommendations for 3 universities in ${location} that are suitable for ${studyLevel} students with a monthly budget of $${budget}.

For each university, provide a COMPREHENSIVE analysis with the following details:

1. Basic Information:
   - Full university name
   - Exact location (city, region, country)
   - Year established
   - Type (Public/Private)
   - QS World Ranking 2024
   - Student population

2. Academic Programs:
   - Available programs for ${studyLevel} level (list at least 5 popular programs)
   - Language of instruction
   - Program duration
   - Research opportunities
   - Faculty expertise

3. Costs Breakdown:
   - Annual tuition fees (exact range for different programs)
   - Monthly living expenses:
     * Accommodation
     * Food
     * Transportation
     * Books and supplies
     * Healthcare/insurance
     * Entertainment
   - One-time fees (application, visa, etc.)

4. Admission Requirements:
   - Academic prerequisites
   - Language requirements (IELTS/TOEFL scores)
   - Required documents
   - Application deadlines (all intakes)
   - Application process
   - Acceptance rate

5. Campus Facilities:
   - Student accommodation options
   - Libraries and study spaces
   - Sports facilities
   - Research centers
   - Student unions
   - Healthcare services

6. Student Support:
   - International student services
   - Career services
   - Academic support
   - Mental health support
   - Language support
   - Cultural integration programs

7. Notable Features:
   - Research strengths
   - Industry connections
   - International partnerships
   - Notable alumni
   - Unique selling points

8. Student Life:
   - Campus culture
   - Student clubs and societies
   - Local community
   - Weather and climate
   - Safety and security

9. Post-Graduation:
   - Employment rate
   - Career prospects
   - Alumni network
   - Post-study work visa options

Format each university's information clearly with proper headings and bullet points. Make sure to include SPECIFIC numbers, dates, and requirements where applicable.`,

            `Act as a career advisor for international students. Suggest 3 realistic part-time job opportunities in ${location} that can help a ${studyLevel} student earn up to $${budget} per month.

For each job opportunity, include:
1. Job title and type
2. Average hourly rate
3. Typical working hours
4. Required skills and experience
5. Popular employers
6. Work permit requirements
7. Application process
8. Tips for success

Format the response with clear headings and bullet points.`,

            `Act as a housing advisor for international students. Provide accommodation advice for ${location} with a monthly budget of $${budget} for a ${studyLevel} student.

Include the following information:
1. Types of accommodation available:
   - University halls
   - Private student housing
   - Shared apartments
2. For each type:
   - Average monthly rent
   - Typical locations
   - Pros and cons
   - What's included
3. Popular student areas
4. Rental requirements and process
5. Additional costs to consider
6. Tips for finding accommodation
7. Reliable websites and resources
8. Safety and security advice

Format the response with clear headings and bullet points.`
        ];

        const responses = await Promise.all(prompts.map(prompt => generateAIResponse(prompt)));
        console.log('Sending auto-search response to client');
        res.json({ status: 'success', responses });

    } catch (error) {
        console.error('Auto-search error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to get auto-search results'
        });
    }
});

export default router;
