import aiService from './aiService.js';

class AIComponent {
    constructor() {
        this.initialized = false;
        this.init();
    }

    async init() {
        try {
            await this.setupEventListeners();
            this.initialized = true;
        } catch (error) {
            console.error('Error initializing AI component:', error);
            this.handleError('ai-error', new Error('Error initializing AI service. Please try again later'));
        }
    }

    async setupEventListeners() {
        // University recommendations
        const universityForm = document.getElementById('university-form');
        if (universityForm) {
            universityForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    if (!this.initialized) {
                        throw new Error('AI service not initialized');
                    }
                    const criteria = this.getFormData(universityForm);
                    await this.getUniversityRecommendations(criteria);
                } catch (error) {
                    this.handleError('university-results', error);
                }
            });
        }

        // Job recommendations
        const jobForm = document.getElementById('job-form');
        if (jobForm) {
            jobForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    if (!this.initialized) {
                        throw new Error('AI service not initialized');
                    }
                    const criteria = this.getFormData(jobForm);
                    await this.getJobRecommendations(criteria);
                } catch (error) {
                    this.handleError('job-results', error);
                }
            });
        }

        // Accommodation advice
        const accommodationForm = document.getElementById('accommodation-form');
        if (accommodationForm) {
            accommodationForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    if (!this.initialized) {
                        throw new Error('AI service not initialized');
                    }
                    const criteria = this.getFormData(accommodationForm);
                    await this.getAccommodationAdvice(criteria);
                } catch (error) {
                    this.handleError('accommodation-results', error);
                }
            });
        }

        // Visa advice
        const visaForm = document.getElementById('visa-form');
        if (visaForm) {
            visaForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    if (!this.initialized) {
                        throw new Error('AI service not initialized');
                    }
                    const criteria = this.getFormData(visaForm);
                    await this.getVisaAdvice(criteria);
                } catch (error) {
                    this.handleError('visa-results', error);
                }
            });
        }

        // Financial advice
        const financeForm = document.getElementById('finance-form');
        if (financeForm) {
            financeForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    if (!this.initialized) {
                        throw new Error('AI service not initialized');
                    }
                    const criteria = this.getFormData(financeForm);
                    await this.getFinancialAdvice(criteria);
                } catch (error) {
                    this.handleError('finance-results', error);
                }
            });
        }
    }

    getFormData(form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        return data;
    }

    async getUniversityRecommendations(criteria) {
        try {
            this.showLoading('university-results');
            const response = await aiService.getUniversityRecommendations(criteria);
            const formattedResponse = aiService.formatAIResponse(response);
            this.displayResults('university-results', formattedResponse);
        } catch (error) {
            this.handleError('university-results', error);
        }
    }

    async getJobRecommendations(criteria) {
        try {
            this.showLoading('job-results');
            const response = await aiService.getJobRecommendations(criteria);
            const formattedResponse = aiService.formatAIResponse(response);
            this.displayResults('job-results', formattedResponse);
        } catch (error) {
            this.handleError('job-results', error);
        }
    }

    async getAccommodationAdvice(criteria) {
        try {
            this.showLoading('accommodation-results');
            const response = await aiService.getAccommodationAdvice(criteria);
            const formattedResponse = aiService.formatAIResponse(response);
            this.displayResults('accommodation-results', formattedResponse);
        } catch (error) {
            this.handleError('accommodation-results', error);
        }
    }

    async getVisaAdvice(criteria) {
        try {
            this.showLoading('visa-results');
            const response = await aiService.getVisaAdvice(criteria);
            const formattedResponse = aiService.formatAIResponse(response);
            this.displayResults('visa-results', formattedResponse);
        } catch (error) {
            this.handleError('visa-results', error);
        }
    }

    async getFinancialAdvice(criteria) {
        try {
            this.showLoading('finance-results');
            const response = await aiService.getFinancialAdvice(criteria);
            const formattedResponse = aiService.formatAIResponse(response);
            this.displayResults('finance-results', formattedResponse);
        } catch (error) {
            this.handleError('finance-results', error);
        }
    }

    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="loading">Getting AI recommendations...</div>';
        }
    }

    displayResults(elementId, results) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<div class="ai-results">${results}</div>`;
        }
    }

    handleError(elementId, error) {
        console.error('Error:', error);
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    }
}

// Initialize the AI component
const aiComponent = new AIComponent();
export default aiComponent;
