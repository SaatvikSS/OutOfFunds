const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is required');
        }
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    async generateResults(criteria) {
        try {
            const prompt = `Generate comprehensive recommendations for a student based on these criteria:
Location: ${criteria.location}
Field of Study: ${criteria.fieldOfStudy}
Level of Study: ${criteria.studyLevel}
Budget: $${criteria.budget} USD

Please provide three sections of results in valid JSON format:

1. Universities: Find universities in or near ${criteria.location} that offer ${criteria.studyLevel} programs in ${criteria.fieldOfStudy} with tuition fees around $${criteria.budget}. Focus on:
   - Programs specifically for ${criteria.studyLevel} level
   - Entry requirements for ${criteria.studyLevel} students
   - Relevant specializations in ${criteria.fieldOfStudy}
   - Program duration and structure
   - Research opportunities (if applicable)

2. Part-time Student Jobs: Find ONLY part-time jobs and internships suitable for ${criteria.studyLevel} students studying ${criteria.fieldOfStudy} in ${criteria.location}. Focus on:
   - Part-time campus jobs (15-20 hours per week)
   - Work-study positions with flexible schedules
   - Part-time research assistant roles (10-15 hours per week)
   - Teaching assistant positions for limited hours
   - Student internships with part-time options
   - Evening/weekend work opportunities
   - Remote part-time positions
   - Jobs specifically marked as "part-time student positions"
   - Roles that accommodate class schedules
   - Maximum 20-25 hours per week
   - Positions that understand academic commitments
   DO NOT include any full-time positions.

3. Student Accommodations: Find student housing options in ${criteria.location} within the monthly budget of $${Math.round(criteria.budget/12)}. Consider:
   - Housing suitable for ${criteria.studyLevel} students
   - Proximity to universities
   - Study-friendly environments
   - Accommodation types popular with ${criteria.studyLevel} students

Format the response as a JSON object with this structure:
{
    "universities": [
        {
            "name": "University Name",
            "location": "Specific Location",
            "tuition": "Annual tuition in USD",
            "description": "Brief description including program details and ${criteria.studyLevel} specific information"
        }
    ],
    "jobs": [
        {
            "title": "Part-time Job Title",
            "company": "Company/Institution Name",
            "location": "Specific Location",
            "salary": "Hourly rate in USD",
            "type": "Part-time",
            "hours": "Maximum hours per week",
            "schedule": "Flexible schedule details",
            "description": "Brief description including part-time hours and student-friendly scheduling"
        }
    ],
    "accommodations": [
        {
            "name": "Accommodation Name",
            "type": "Type (e.g., Student Housing, Shared Apartment)",
            "location": "Specific Location",
            "rent": "Monthly rent in USD",
            "description": "Brief description including amenities and suitability for ${criteria.studyLevel} students"
        }
    ]
}

Ensure all monetary values are numbers without currency symbols or commas.`;

            const result = await this.model.generateContent(prompt);
            const text = result.response.text();
            console.log('Raw response:', text);

            try {
                // Extract JSON from the response
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (!jsonMatch) {
                    console.error('No JSON found in response');
                    return this.getDefaultResponse();
                }

                const data = JSON.parse(jsonMatch[0]);
                console.log('Parsed data:', data);

                // Validate and clean the data
                return {
                    universities: this.validateAndCleanUniversities(data.universities),
                    jobs: this.validateAndCleanJobs(data.jobs),
                    accommodations: this.validateAndCleanAccommodations(data.accommodations)
                };

            } catch (error) {
                console.error('Error parsing response:', error);
                return this.getDefaultResponse();
            }
        } catch (error) {
            console.error('Error calling Gemini:', error);
            return this.getDefaultResponse();
        }
    }

    validateAndCleanUniversities(universities) {
        if (!Array.isArray(universities)) return [];
        
        return universities
            .filter(uni => uni && typeof uni === 'object')
            .map(uni => ({
                name: String(uni.name || '').trim(),
                location: String(uni.location || '').trim(),
                tuition: String(uni.tuition || '').trim(),
                description: String(uni.description || '').trim()
            }));
    }

    validateAndCleanJobs(jobs) {
        if (!Array.isArray(jobs)) return [];
        
        return jobs
            .filter(job => job && typeof job === 'object')
            .map(job => ({
                title: String(job.title || '').trim(),
                company: String(job.company || '').trim(),
                location: String(job.location || '').trim(),
                salary: String(job.salary || '').trim(),
                type: String(job.type || '').trim(),
                hours: String(job.hours || '').trim(),
                schedule: String(job.schedule || '').trim(),
                description: String(job.description || '').trim()
            }));
    }

    validateAndCleanAccommodations(accommodations) {
        if (!Array.isArray(accommodations)) return [];
        
        return accommodations
            .filter(acc => acc && typeof acc === 'object')
            .map(acc => ({
                name: String(acc.name || '').trim(),
                type: String(acc.type || '').trim(),
                location: String(acc.location || '').trim(),
                rent: String(acc.rent || '').trim(),
                description: String(acc.description || '').trim()
            }));
    }

    getDefaultResponse() {
        return {
            universities: [],
            jobs: [],
            accommodations: []
        };
    }
}

module.exports = new GeminiService();
