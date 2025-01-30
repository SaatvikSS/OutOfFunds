import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini AI
const initGemini = (apiKey) => {
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

router.post('/search', async (req, res) => {
    try {
        const { location, budget, studyLevel } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY not configured');
        }

        const model = initGemini(process.env.GEMINI_API_KEY);

        // Create a comprehensive prompt for all information
        const prompt = `As an educational advisor, provide detailed information about studying in ${location} for a ${studyLevel} student with a monthly budget of $${budget}. Structure your response in three sections:

1. Universities:
- List suitable universities in ${location} for ${studyLevel} studies
- Include typical tuition fees
- Mention notable programs and specializations
- Provide admission requirements and deadlines
- List any scholarship opportunities

2. Part-time Jobs:
- Common part-time job opportunities for students in ${location}
- Expected hourly wages and working hours
- Required skills or qualifications
- Tips for finding student jobs
- Work visa/permit requirements for international students

3. Accommodation:
- Types of student accommodation available
- Average monthly rent in different areas
- Popular student neighborhoods
- Typical utilities and additional costs
- Tips for finding student housing

Please provide specific, actionable information that would be helpful for a student planning to study in ${location}.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Split the response into sections
        const sections = text.split(/\d\.\s+(?:Universities|Part-time Jobs|Accommodation):/);
        const [_, universities, jobs, accommodation] = sections;

        res.json({
            universities: universities?.trim() || 'No university information available',
            jobs: jobs?.trim() || 'No job information available',
            accommodation: accommodation?.trim() || 'No accommodation information available'
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

export default router;
