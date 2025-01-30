const universitiesData = require('./data/universities.json');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { location, budget, studyLevel } = req.body;

        // Filter universities based on criteria
        const filteredUniversities = universitiesData.filter(uni => {
            return uni.location.toLowerCase().includes(location.toLowerCase()) &&
                   uni.tuition <= parseInt(budget) &&
                   uni.programs.some(prog => prog.toLowerCase().includes(studyLevel.toLowerCase()));
        });

        // Sort by ranking
        const sortedUniversities = filteredUniversities.sort((a, b) => a.ranking - b.ranking);

        // Take top 5 results
        const results = sortedUniversities.slice(0, 5);

        res.status(200).json({ data: results });
    } catch (error) {
        console.error('Error in universities API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
