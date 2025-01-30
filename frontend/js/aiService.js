// AI Service for handling AI-related functionality
class AIService {
    constructor() {
        this.baseUrl = 'http://localhost:3002/api/search';
    }

    async makeRequest(endpoint, criteria) {
        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(criteria)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`${endpoint} response:`, data);
            return data || null;
        } catch (error) {
            console.error(`Error in ${endpoint} request:`, error);
            return null;
        }
    }

    async getRecommendations(criteria) {
        try {
            console.log('Searching with criteria:', criteria);

            // Make all requests in parallel
            const [universitiesRes, jobsRes, accommodationRes] = await Promise.all([
                this.makeRequest('universities', criteria),
                this.makeRequest('jobs', criteria),
                this.makeRequest('accommodation', criteria)
            ]);

            // Ensure each section has a valid array
            const results = {
                universities: Array.isArray(universitiesRes?.universities) ? universitiesRes.universities : [],
                jobs: Array.isArray(jobsRes?.jobs) ? jobsRes.jobs : [],
                accommodations: Array.isArray(accommodationRes?.accommodations) ? accommodationRes.accommodations : []
            };

            console.log('Processed results:', results);
            return results;
        } catch (error) {
            console.error('Error getting recommendations:', error);
            // Return empty arrays for all sections in case of error
            return {
                universities: [],
                jobs: [],
                accommodations: []
            };
        }
    }
}

// Export a single instance
const aiService = new AIService();
export { aiService };
