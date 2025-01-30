// AI Service for handling AI-related functionality
class AiService {
    async makeRequest(endpoint, data) {
        try {
            const response = await fetch(`/api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: response.statusText }));
                throw new Error(errorData.error || `API call failed: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error calling ${endpoint} API:`, error);
            throw error;
        }
    }

    formatUniversityData(university) {
        if (!university) return '';
        return `
            ${university.name}
            Location: ${university.location}
            Tuition: ${university.tuition} per year
            Programs: ${university.programs.join(', ')}
            Student Population: ${university.studentPopulation}
            International Students: ${university.internationalStudents}
            Campus Size: ${university.campusSize}
            Founded: ${university.founded}
            QS World Ranking: Top ${university.ranking}
            Research Focus: ${university.researchFocus}
            Notable Alumni: ${university.notableAlumni.join(', ')}
            Student-to-Faculty Ratio: ${university.studentToFacultyRatio}
            Acceptance Rate: ${university.acceptanceRate}
            
            Facilities:
            ${university.facilities.map(f => '- ' + f).join('\n')}
            
            Scholarships Available: ${university.scholarships.available ? 'Yes' : 'No'}
            ${university.scholarships.types.map(s => '- ' + s).join('\n')}
            
            Career Services:
            - ${university.careerServices.employmentRate} employment rate within 6 months
            ${university.careerServices.partnerships.map(p => '- ' + p).join('\n')}
        `;
    }

    formatJobData(job) {
        if (!job) return '';
        return `
            ${job.title}
            Company: ${job.company}
            Location: ${job.location}
            Salary: ${job.salary} per year
            Employment Type: ${job.employmentType}
            Experience Level: ${job.experienceLevel}
            Requirements: ${job.requirements}
            
            Technical Skills Required:
            ${job.technicalSkills.map(s => '- ' + s).join('\n')}
            
            Benefits:
            ${job.benefits.map(b => '- ' + b).join('\n')}
            
            Career Growth:
            - ${job.careerGrowth.promotions}
            ${job.careerGrowth.training.map(t => '- ' + t).join('\n')}
            
            Company Culture:
            ${job.companyCulture.map(c => '- ' + c).join('\n')}
        `;
    }

    formatAccommodationData(accommodation) {
        if (!accommodation) return '';
        return `
            ${accommodation.name}
            Location: ${accommodation.location}
            Rent: ${accommodation.rent} per month
            Room Type: ${accommodation.roomType}
            Building Type: ${accommodation.buildingType}
            Distance to Campus: ${accommodation.distanceToCampus} minutes walk
            
            Amenities:
            ${accommodation.amenities.map(a => '- ' + a).join('\n')}
            
            Utilities Included:
            ${accommodation.utilities.map(u => '- ' + u).join('\n')}
            
            Community Features:
            ${accommodation.communityFeatures.map(f => '- ' + f).join('\n')}
        `;
    }

    async getUniversityRecommendations(criteria) {
        try {
            const response = await this.makeRequest('universities', criteria);
            return {
                data: response.data.map(uni => this.formatUniversityData(uni)).join('\n\n')
            };
        } catch (error) {
            console.error('Error getting university recommendations:', error);
            return { error: error.message };
        }
    }

    async getJobRecommendations(criteria) {
        try {
            const response = await this.makeRequest('jobs', criteria);
            return {
                data: response.data.map(job => this.formatJobData(job)).join('\n\n')
            };
        } catch (error) {
            console.error('Error getting job recommendations:', error);
            return { error: error.message };
        }
    }

    async getAccommodationRecommendations(criteria) {
        try {
            const response = await this.makeRequest('accommodation', criteria);
            return {
                data: response.data.map(acc => this.formatAccommodationData(acc)).join('\n\n')
            };
        } catch (error) {
            console.error('Error getting accommodation recommendations:', error);
            return { error: error.message };
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
                accommodation: accommodation.data ? [accommodation.data] : [],
                error: universities.error || jobs.error || accommodation.error
            };
        } catch (error) {
            console.error('Error getting recommendations:', error);
            return {
                universities: [],
                jobs: [],
                accommodation: [],
                error: error.message
            };
        }
    }
}

export const aiService = new AiService();
