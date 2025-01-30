// AI Service for handling AI-related functionality
class AiService {
    async getUniversityRecommendations(criteria) {
        return {
            data: `University Recommendations for ${criteria.location}:
                
                University of ${criteria.location}
                Location: ${criteria.location}
                Tuition: ${criteria.budget} per year
                Programs: Bachelor's, Master's, PhD
                
                ${criteria.location} State University
                Location: ${criteria.location}
                Tuition: ${parseInt(criteria.budget) * 0.8} per year
                Programs: ${criteria.studyLevel}, Research Programs
                
                ${criteria.location} Institute of Technology
                Location: ${criteria.location}
                Tuition: ${parseInt(criteria.budget) * 1.2} per year
                Programs: Engineering, Technology, Sciences`
        };
    }

    async getJobRecommendations(criteria) {
        return {
            data: `Job Opportunities in ${criteria.location}:
                
                Software Developer
                Company: Tech Solutions ${criteria.location}
                Salary: ${parseInt(criteria.budget) * 0.8} per year
                Requirements: ${criteria.studyLevel} in Computer Science
                
                Research Assistant
                Company: ${criteria.location} Research Institute
                Salary: ${parseInt(criteria.budget) * 0.5} per year
                Requirements: Enrolled in ${criteria.studyLevel}
                
                Teaching Assistant
                Company: University of ${criteria.location}
                Salary: ${parseInt(criteria.budget) * 0.4} per year
                Requirements: ${criteria.studyLevel} student`
        };
    }

    async getAccommodationRecommendations(criteria) {
        return {
            data: `Accommodation Options in ${criteria.location}:
                
                Student Residence Hall
                Location: Near University of ${criteria.location}
                Rent: ${parseInt(criteria.budget) * 0.3} per month
                Amenities: Furnished, Utilities Included, Study Areas
                
                Shared Apartment
                Location: ${criteria.location} City Center
                Rent: ${parseInt(criteria.budget) * 0.25} per month
                Amenities: Fully Furnished, WiFi, Shared Kitchen
                
                Private Studio
                Location: ${criteria.location} Student District
                Rent: ${parseInt(criteria.budget) * 0.4} per month
                Amenities: Private Bathroom, Kitchen, Study Desk`
        };
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
}

export const aiService = new AiService();
