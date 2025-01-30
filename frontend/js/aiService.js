// AI Service for handling AI-related functionality
class AiService {
    async makeRequest(endpoint, criteria) {
        try {
            console.log(`Making request to ${endpoint} with criteria:`, criteria);
            const response = await fetch(`/api/ai/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(criteria)
            });
            
            const data = await response.json();
            console.log(`Data from ${endpoint}:`, data);
            
            if (!response.ok) {
                throw new Error(data.message || `Failed to get ${endpoint} recommendations`);
            }
            
            return {
                data: data.data || data.response || data,
                message: data.message
            };
        } catch (error) {
            console.error(`Error in ${endpoint}:`, error);
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your connection and ensure the server is running.');
            }
            throw error;
        }
    }

    async getRecommendations(criteria) {
        try {
            const [universities, jobs, accommodation] = await Promise.all([
                this.getUniversityRecommendations(criteria),
                this.getJobRecommendations(criteria),
                this.getAccommodationRecommendations(criteria)
            ]);

            return {
                universities: universities.data ? [universities.data] : [],
                jobs: jobs.data ? [jobs.data] : [],
                accommodation: accommodation.data ? [accommodation.data] : []
            };
        } catch (error) {
            console.error('Error getting recommendations:', error);
            throw error;
        }
    }

    async getUniversityRecommendations(criteria) {
        return this.makeRequest('universities', criteria);
    }

    async getJobRecommendations(criteria) {
        return this.makeRequest('jobs', criteria);
    }

    async getAccommodationRecommendations(criteria) {
        return this.makeRequest('accommodation', criteria);
    }
}

export const aiService = new AiService();
