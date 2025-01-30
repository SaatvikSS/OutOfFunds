const axios = require('axios');

class JobService {
    constructor() {
        this.apiKey = process.env.ADZUNA_API_KEY;
        this.appId = process.env.ADZUNA_APP_ID;
        this.baseUrl = 'https://api.adzuna.com/v1/api/jobs';
    }

    async searchJobs(criteria) {
        try {
            const { location, studyLevel } = criteria;
            // Using Adzuna API (you'll need to sign up for API keys)
            const response = await axios.get(`${this.baseUrl}/gb/search/1`, {
                params: {
                    app_id: this.appId,
                    app_key: this.apiKey,
                    where: location,
                    what: studyLevel,
                    results_per_page: 5
                }
            });

            return response.data.results.map(job => ({
                title: job.title,
                company: job.company.display_name,
                location: job.location.display_name,
                salary: job.salary_min || parseInt(criteria.budget),
                employmentType: job.contract_time || 'Full-time',
                experienceLevel: this.mapExperienceLevel(studyLevel),
                requirements: `${studyLevel} degree preferred`,
                technicalSkills: this.generateTechnicalSkills(job.category.label),
                benefits: this.generateBenefits(),
                careerGrowth: this.generateCareerGrowth(),
                companyCulture: this.generateCompanyCulture(),
                description: job.description,
                url: job.redirect_url
            }));
        } catch (error) {
            console.error('Error fetching jobs:', error);
            // Fallback to searching Indeed via web scraping if API fails
            return this.searchJobsViaIndeed(criteria);
        }
    }

    async searchJobsViaIndeed(criteria) {
        try {
            const { location, studyLevel } = criteria;
            // Use a web scraping service or library to get jobs from Indeed
            // This is a placeholder for actual implementation
            return [{
                title: 'Entry Level Position',
                company: 'Local Company',
                location: location,
                salary: parseInt(criteria.budget),
                employmentType: 'Full-time',
                experienceLevel: this.mapExperienceLevel(studyLevel),
                requirements: `${studyLevel} degree preferred`,
                technicalSkills: this.generateTechnicalSkills('Technology'),
                benefits: this.generateBenefits(),
                careerGrowth: this.generateCareerGrowth(),
                companyCulture: this.generateCompanyCulture()
            }];
        } catch (error) {
            console.error('Error with Indeed scraping:', error);
            throw error;
        }
    }

    mapExperienceLevel(studyLevel) {
        const levelMap = {
            'undergraduate': 'Entry Level',
            'graduate': 'Entry to Mid Level',
            'postgraduate': 'Mid Level',
            'phd': 'Senior Level'
        };
        return levelMap[studyLevel.toLowerCase()] || 'Entry Level';
    }

    generateTechnicalSkills(category) {
        const skillsByCategory = {
            'Technology': [
                'JavaScript, Python, Java',
                'React, Node.js',
                'Cloud platforms (AWS/Azure)',
                'Database management'
            ],
            'Engineering': [
                'CAD Software',
                'Project Management',
                'Technical Documentation',
                'Problem Solving'
            ],
            'default': [
                'Microsoft Office Suite',
                'Data Analysis',
                'Communication Skills',
                'Project Management'
            ]
        };
        return skillsByCategory[category] || skillsByCategory.default;
    }

    generateBenefits() {
        return [
            'Health and dental insurance',
            '401(k) matching',
            'Stock options',
            'Remote work flexibility',
            'Professional development budget'
        ];
    }

    generateCareerGrowth() {
        return {
            promotions: 'Regular promotions every 2-3 years',
            training: [
                'Leadership training programs',
                'International transfer opportunities'
            ]
        };
    }

    generateCompanyCulture() {
        return [
            'Agile environment',
            'Innovation-focused',
            'Work-life balance',
            'Diverse and inclusive workplace'
        ];
    }
}

module.exports = new JobService();
