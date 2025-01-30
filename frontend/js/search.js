import { aiService } from './aiService.js';

class Search {
    constructor() {
        this.form = document.getElementById('searchForm');
        this.resultsContent = document.getElementById('results-content');
        this.resultsSection = document.querySelector('.results-section');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.results = {};
        this.activeTab = 'universities';
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSubmit();
            });
        }
    }

    async handleSubmit() {
        try {
            // Disable submit button and show loading state
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';

            // Get form data
            const location = document.getElementById('location').value;
            const budget = document.getElementById('budget').value;
            const studyLevel = document.getElementById('studyLevel').value;

            // Validate form data
            if (!location || !budget || !studyLevel) {
                throw new Error('Please fill in all fields');
            }

            // Show loading state in results
            this.resultsSection.style.display = 'block';
            this.resultsContent.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-spinner fa-spin fa-3x"></i>
                    <p style="margin-top: 20px;">Searching for the best matches...</p>
                </div>
            `;

            // Make API call
            const searchData = {
                location: location,
                budget: budget,
                studyLevel: studyLevel,
                minResults: 5
            };

            // Get recommendations using aiService
            const response = await aiService.getRecommendations(searchData);
            
            // Store results
            this.results = response;

            // Display results
            this.displayResults();

            // Scroll to results
            this.resultsContent.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error('Search error:', error);
            
            // Show error message
            this.resultsSection.style.display = 'block';
            this.resultsContent.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <i class="fas fa-exclamation-circle" style="color: #dc3545; font-size: 48px;"></i>
                    <p style="color: #dc3545; font-size: 18px; margin-top: 20px; font-weight: bold;">Search Failed</p>
                    <p style="color: #666; margin-top: 10px;">${error.message || 'An error occurred while searching. Please try again.'}</p>
                </div>
            `;

        } finally {
            // Reset submit button
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = '<i class="fas fa-search"></i> Search';
        }
    }

    switchTab(tabName) {
        this.activeTab = tabName;
        this.displayResults();
    }

    cleanText(text) {
        if (!text) return '';
        return text.replace(/[*#]/g, '').trim();
    }

    formatContent(item) {
        if (!item) return '';
        
        let content = typeof item === 'string' ? item : JSON.stringify(item, null, 2);
        const lines = content.split('\n')
            .map(line => this.cleanText(line))
            .filter(line => line);
            
        let formattedHtml = '<div class="result-item">';
        let currentSection = '';
        let details = [];
        
        lines.forEach(line => {
            const cleanLine = this.cleanText(line);
            
            if (line.toLowerCase().includes('university') || 
                line.toLowerCase().includes('college') || 
                line.toLowerCase().includes('institute')) {
                if (currentSection && details.length > 0) {
                    formattedHtml += this.formatSection(currentSection, details);
                    details = [];
                }
                currentSection = `<div class="section-heading universities">${cleanLine}</div>`;
            } else if (line.toLowerCase().includes('job') || 
                      line.toLowerCase().includes('position')) {
                if (currentSection && details.length > 0) {
                    formattedHtml += this.formatSection(currentSection, details);
                    details = [];
                }
                currentSection = `<div class="section-heading jobs">${cleanLine}</div>`;
            } else if (line.toLowerCase().includes('accommodation') || 
                      line.toLowerCase().includes('housing')) {
                if (currentSection && details.length > 0) {
                    formattedHtml += this.formatSection(currentSection, details);
                    details = [];
                }
                currentSection = `<div class="section-heading accommodation">${cleanLine}</div>`;
            } else {
                details.push(cleanLine);
            }
        });
        
        if (currentSection && details.length > 0) {
            formattedHtml += this.formatSection(currentSection, details);
        }
        
        formattedHtml += '</div>';
        return formattedHtml;
    }

    formatSection(heading, details) {
        let html = heading + '<div class="details-container">';
        
        details.forEach(detail => {
            if (detail.includes(':')) {
                const [label, value] = detail.split(':').map(part => part.trim());
                html += `
                    <div class="detail-row">
                        <div class="detail-label">${label}:</div>
                        <div class="detail-value">${value}</div>
                    </div>`;
            } else {
                html += `<div class="detail-text">${detail}</div>`;
            }
        });
        
        html += '</div>';
        return html;
    }

    displayResults() {
        if (!this.resultsContent) return;

        const sections = {
            universities: this.results.universities || [],
            jobs: this.results.jobs || [],
            accommodation: this.results.accommodation || []
        };

        let resultsHtml = `
            <div class="results-container">
                <div class="tabs-container">
                    <button class="tab-button universities ${this.activeTab === 'universities' ? 'active' : ''}"
                            onclick="window.searchComponent.switchTab('universities')">
                        <i class="fas fa-university"></i> Universities
                    </button>
                    <button class="tab-button jobs ${this.activeTab === 'jobs' ? 'active' : ''}"
                            onclick="window.searchComponent.switchTab('jobs')">
                        <i class="fas fa-briefcase"></i> Jobs
                    </button>
                    <button class="tab-button accommodation ${this.activeTab === 'accommodation' ? 'active' : ''}"
                            onclick="window.searchComponent.switchTab('accommodation')">
                        <i class="fas fa-home"></i> Accommodation
                    </button>
                </div>
                <div class="tab-content">`;

        if (!sections[this.activeTab] || sections[this.activeTab].length === 0) {
            resultsHtml += `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No ${this.activeTab} found matching your criteria.</p>
                </div>`;
        } else {
            sections[this.activeTab].forEach(item => {
                resultsHtml += this.formatContent(item);
            });
        }

        resultsHtml += `
                </div>
            </div>`;
        
        this.resultsContent.innerHTML = resultsHtml;
    }
}

// Initialize when DOM is loaded
const search = new Search();
window.searchComponent = search;
