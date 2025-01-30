const axios = require('axios');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function generateContent(prompt) {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    try {
        const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            contents: [{
                parts: [{ text: prompt }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.data.candidates || response.data.candidates.length === 0) {
            throw new Error('No response from AI service');
        }

        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error calling Gemini API:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || error.message);
    }
}

async function getUniversityRecommendations({ location, budget, studyLevel }) {
    const prompt = `Act as an education advisor and provide 3 university recommendations based on these criteria:
    - Location: ${location}
    - Monthly Budget: $${budget}
    - Study Level: ${studyLevel}

    For each university, provide this information in a clear, structured format:
    1. University Name
    2. Location (city, country)
    3. World Ranking (approximate)
    4. Available Programs for ${studyLevel}
    5. Estimated Annual Tuition
    6. Living Costs
    7. Notable Features (facilities, research opportunities, etc.)
    8. Admission Requirements

    Format your response so it's easy to parse and display. Use clear headings and bullet points.`;
    
    return generateContent(prompt);
}

async function getJobRecommendations({ location, budget, studyLevel }) {
    const prompt = `Act as a career advisor and suggest 3 part-time job opportunities for a ${studyLevel} student in ${location} with these criteria:
    - Location: ${location}
    - Target Monthly Income: $${budget}
    - Study Level: ${studyLevel}

    For each job opportunity, provide:
    1. Job Title
    2. Type (part-time, flexible, remote, etc.)
    3. Typical Hourly Rate
    4. Hours per Week
    5. Key Requirements
    6. Main Responsibilities
    7. Benefits
    8. Companies that typically hire

    Format your response so it's easy to parse and display. Use clear headings and bullet points.`;
    
    return generateContent(prompt);
}

async function getAccommodationAdvice({ location, budget, studyLevel }) {
    const prompt = `Act as a housing advisor and recommend 3 accommodation options for a ${studyLevel} student in ${location} with these criteria:
    - Location: ${location}
    - Monthly Budget: $${budget}
    - Student Level: ${studyLevel}

    For each accommodation option, provide:
    1. Type (student hall, shared apartment, studio, etc.)
    2. Location/Area
    3. Monthly Rent
    4. What's Included (utilities, internet, etc.)
    5. Distance to City Center
    6. Available Amenities
    7. Pros and Cons
    8. Booking/Application Process

    Format your response so it's easy to parse and display. Use clear headings and bullet points.`;
    
    return generateContent(prompt);
}

async function getVisaAndImmigrationAdvice({ location, studyLevel }) {
    const prompt = `Act as an immigration advisor and provide detailed visa information for ${studyLevel} students planning to study in ${location}.

    Please cover:
    1. Type of Student Visa Required
    2. Application Process
    3. Required Documents
    4. Processing Time
    5. Visa Fees
    6. Working Rights
    7. Healthcare Requirements
    8. Important Deadlines

    Format your response so it's easy to parse and display. Use clear headings and bullet points.`;
    
    return generateContent(prompt);
}

async function getFinancialAdvice({ location, budget, studyLevel }) {
    const prompt = `Act as a financial advisor and provide detailed financial planning advice for a ${studyLevel} student planning to study in ${location} with a monthly budget of $${budget}.

    Please cover:
    1. Monthly Budget Breakdown
    2. Estimated Living Costs
    3. Banking Setup
    4. Available Scholarships
    5. Part-time Work Options
    6. Tax Considerations
    7. Money-saving Tips
    8. Emergency Fund Advice

    Format your response so it's easy to parse and display. Use clear headings and bullet points.`;
    
    return generateContent(prompt);
}

module.exports = {
    generateContent,
    getUniversityRecommendations,
    getJobRecommendations,
    getAccommodationAdvice,
    getVisaAndImmigrationAdvice,
    getFinancialAdvice
};
