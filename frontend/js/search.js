console.log('Search.js loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    const form = document.getElementById('searchForm');
    const resultsDiv = document.getElementById('resultsContainer');
    let searchResults = null;

    // Tab handling
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabName).classList.add('active');

            // If we have results, update the content
            if (searchResults) {
                updateTabContent(tabName, searchResults);
            }
        });
    });

    function updateTabContent(tabName, data) {
        const tabContent = document.getElementById(tabName);
        let html = '';

        switch(tabName) {
            case 'universities':
                if (data.universities && data.universities.length > 0) {
                    data.universities.forEach(uni => {
                        html += `
                            <div class="card">
                                <h3>${uni.name || 'University Name Not Available'}</h3>
                                <p><strong>Location:</strong> ${uni.location || 'Location Not Available'}</p>
                                <p><strong>Tuition:</strong> ${uni.tuition ? '$' + uni.tuition : 'Not Available'}</p>
                                <p>${uni.description || 'No description available'}</p>
                            </div>
                        `;
                    });
                } else {
                    html = '<div class="no-results">No universities found matching your criteria.</div>';
                }
                break;

            case 'jobs':
                if (data.jobs && data.jobs.length > 0) {
                    data.jobs.forEach(job => {
                        html += `
                            <div class="card">
                                <h3>${job.title || 'Job Title Not Available'}</h3>
                                <p><strong>Company:</strong> ${job.company || 'Company Not Available'}</p>
                                <p><strong>Location:</strong> ${job.location || 'Location Not Available'}</p>
                                <p><strong>Type:</strong> ${job.type || 'Part-time'}</p>
                                <p><strong>Hours:</strong> ${job.hours || 'Up to 20-25 hours per week'}</p>
                                <p><strong>Schedule:</strong> ${job.schedule || 'Flexible hours'}</p>
                                <p><strong>Pay Rate:</strong> ${job.salary || 'Not Available'}</p>
                                <p>${job.description || 'No description available'}</p>
                            </div>
                        `;
                    });
                } else {
                    html = '<div class="no-results">No part-time student jobs found matching your criteria.</div>';
                }
                break;

            case 'accommodations':
                if (data.accommodations && data.accommodations.length > 0) {
                    data.accommodations.forEach(acc => {
                        html += `
                            <div class="card">
                                <h3>${acc.name || 'Accommodation Name Not Available'}</h3>
                                <p><strong>Type:</strong> ${acc.type || 'Type Not Available'}</p>
                                <p><strong>Location:</strong> ${acc.location || 'Location Not Available'}</p>
                                <p><strong>Monthly Rent:</strong> ${acc.rent ? '$' + acc.rent : 'Not Available'}</p>
                                <p>${acc.description || 'No description available'}</p>
                            </div>
                        `;
                    });
                } else {
                    html = '<div class="no-results">No accommodations found matching your criteria.</div>';
                }
                break;
        }

        tabContent.innerHTML = html;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        try {
            // Show loading state
            resultsDiv.style.display = 'block';
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.innerHTML = '<div class="loading">Searching for recommendations...</div>';
            });

            // Get form data
            const formData = {
                location: form.querySelector('[name="location"]').value,
                budget: form.querySelector('[name="budget"]').value,
                fieldOfStudy: form.querySelector('[name="fieldOfStudy"]').value,
                studyLevel: form.querySelector('[name="studyLevel"]').value
            };

            console.log('Form data:', formData);

            // Make the request
            const response = await fetch('http://localhost:3002/api/search/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Response data:', data);
            
            // Store the results
            searchResults = data;

            // Update the active tab content
            const activeTab = document.querySelector('.tab-button.active').dataset.tab;
            updateTabContent(activeTab, data);

        } catch (error) {
            console.error('Search error:', error);
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.innerHTML = `
                    <div class="error">
                        <h3>Search Failed</h3>
                        <p>An error occurred while searching. Please try again.</p>
                        <p>Error details: ${error.message}</p>
                    </div>
                `;
            });
        }
    });
});
