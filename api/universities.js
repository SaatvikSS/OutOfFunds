const data = require('./data/universities.json');
const universitiesData = data.universities;

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { location = '', budget = '0', studyLevel = '' } = req.body;

        // Filter universities based on criteria
        const filteredUniversities = universitiesData.filter(uni => {
            const locationMatch = !location || uni.location.toLowerCase().includes(location.toLowerCase());
            const budgetMatch = !budget || uni.tuition <= parseInt(budget || '0');
            const studyLevelMatch = !studyLevel || uni.programs.some(prog => 
                prog.toLowerCase().includes(studyLevel.toLowerCase()) ||
                studyLevel.toLowerCase().includes(prog.toLowerCase())
            );

            return locationMatch && budgetMatch && studyLevelMatch;
        });

        // If no results, return all universities
        const results = filteredUniversities.length > 0 ? filteredUniversities : universitiesData;

        // Sort by ranking and take top 5
        const sortedResults = results.sort((a, b) => a.ranking - b.ranking).slice(0, 5);

        res.status(200).json({ data: sortedResults });
    } catch (error) {
        console.error('Error in universities API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
