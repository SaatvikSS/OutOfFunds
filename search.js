function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';

        // Update formatting to remove ## and add bold caps
        let content = '';
        if (result.type === 'university') {
            content = `<strong>${result.name.toUpperCase()}</strong>`;
        } else if (result.type === 'job') {
            content = `<strong>${result.title.toUpperCase()}</strong>`;
        } else if (result.type === 'accommodation') {
            content = `<strong>${result.name.toUpperCase()}</strong>`;
        }

        resultElement.innerHTML = content;
        resultsContainer.appendChild(resultElement);
    });
} 