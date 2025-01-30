// Initialize the Gemini API
let API_KEY;
let genAI;

// Get DOM elements
const promptInput = document.getElementById('prompt');
const submitButton = document.getElementById('submit');
const responseDiv = document.getElementById('response');
const loadingDiv = document.getElementById('loading');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.querySelector('.results-section');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Helper function to format the response
function formatResponse(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
        .replace(/\n/g, '<br>'); // Line breaks
}

// Wait for the GoogleGenerativeAI to be available
function waitForGoogleAI() {
    return new Promise((resolve) => {
        const check = () => {
            if (window.GoogleGenerativeAI) {
                resolve(window.GoogleGenerativeAI);
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}

// Fetch API key from server
async function getApiKey() {
    try {
        const response = await fetch('/api/key');
        const data = await response.json();
        return data.key;
    } catch (error) {
        console.error('Error fetching API key:', error);
        throw new Error('Could not get API key from server');
    }
}

// Initialize Gemini API
async function initializeAI() {
    try {
        const response = await fetch('/api/key');
        const data = await response.json();
        if (!data.key) {
            throw new Error('API key not found');
        }
        genAI = new window.GoogleGenerativeAI(data.key);
        console.log('AI initialized successfully');
    } catch (error) {
        console.error('Error initializing AI:', error);
        alert('Error initializing AI service. Please try again later.');
    }
}

// Main function to generate content
async function generateContent() {
    try {
        // Show loading animation
        responseDiv.innerHTML = '';
        loadingDiv.classList.remove('hidden');
        submitButton.disabled = true;

        // Get the user's prompt
        const prompt = promptInput.value.trim();
        if (!prompt) {
            throw new Error('Please enter a question');
        }

        // Get API key and initialize Gemini
        if (!API_KEY) {
            API_KEY = await getApiKey();
            if (!API_KEY) {
                throw new Error('API key not configured. Please set GEMINI_API_KEY in the server environment.');
            }
        }

        // Wait for GoogleGenerativeAI to be available
        const GoogleGenerativeAI = await waitForGoogleAI();
        const genAI = new GoogleGenerativeAI(API_KEY);

        // Prepare the context and prompt
        const fullPrompt = `You are an AI study abroad assistant. Help the student with their query about studying abroad. 
        Be informative but concise. Format important information with **bold** text.
        If suggesting universities, include brief details about rankings, costs, and notable programs.
        If discussing a city, mention key points about student life, living costs, and culture.
        
        Student's Query: ${prompt}`;

        // Generate content using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        // Format and display the response
        responseDiv.innerHTML = formatResponse(text);
    } catch (error) {
        console.error('Error:', error);
        responseDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    } finally {
        // Hide loading animation
        loadingDiv.classList.add('hidden');
        submitButton.disabled = false;
    }
}

import aiService from './aiService.js';

// Handle Search
async function handleSearch() {
    try {
        // Show loading state
        resultsSection.classList.remove('hidden');
        showLoading();

        // Get search criteria
        const location = document.getElementById('location').value;
        const budget = document.getElementById('budget').value;
        const studyLevel = document.getElementById('studyLevel').value;

        if (!location || !budget || !studyLevel) {
            throw new Error('Please fill in all search fields');
        }

        const criteria = { location, budget, studyLevel };

        // Get recommendations for all categories
        const [universities, jobs, accommodation] = await Promise.all([
            aiService.getUniversityRecommendations(criteria),
            aiService.getJobRecommendations(criteria),
            aiService.getAccommodationAdvice(criteria)
        ]);

        // Display results
        displayResults({
            universities,
            jobs,
            accommodation
        });

    } catch (error) {
        console.error('Search error:', error);
        showError(error.message);
    }
}

// Display Functions
function displayResults(results) {
    // Display university results
    const universitiesContent = document.getElementById('universities-content');
    if (universitiesContent && results.universities) {
        const formattedUniversities = aiService.formatAIResponse(results.universities);
        universitiesContent.innerHTML = `<div class="results-list">${formattedUniversities}</div>`;
    }

    // Display job results
    const jobsContent = document.getElementById('jobs-content');
    if (jobsContent && results.jobs) {
        const formattedJobs = aiService.formatAIResponse(results.jobs);
        jobsContent.innerHTML = `<div class="results-list">${formattedJobs}</div>`;
    }

    // Display accommodation results
    const accommodationContent = document.getElementById('accommodation-content');
    if (accommodationContent && results.accommodation) {
        const formattedAccommodation = aiService.formatAIResponse(results.accommodation);
        accommodationContent.innerHTML = `<div class="results-list">${formattedAccommodation}</div>`;
    }
}

function showLoading() {
    const resultContainers = document.querySelectorAll('.results-content');
    resultContainers.forEach(container => {
        container.innerHTML = '<div class="loading">Getting AI recommendations...</div>';
    });
}

function showError(message) {
    const resultContainers = document.querySelectorAll('.results-content');
    resultContainers.forEach(container => {
        container.innerHTML = `<div class="error">Error: ${message}</div>`;
    });
}

// Tab Functionality
function handleTabClick(selectedTab) {
    // Remove active class from all buttons and contents
    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.results-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Add active class to selected button and show corresponding content
    selectedTab.classList.add('active');
    const contentId = `${selectedTab.dataset.tab}-content`;
    const content = document.getElementById(contentId);
    if (content) {
        content.classList.remove('hidden');
    }
}

// Event Listeners
if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => handleTabClick(btn));
});

submitButton.addEventListener('click', generateContent);

promptInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        generateContent();
    }
});

// Initial focus
promptInput.focus();

// Initialize AI when page loads
initializeAI();
