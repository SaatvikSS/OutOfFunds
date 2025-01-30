const data = require('./data/accommodation.json');
const accommodationData = data.accommodation;

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { location = '', budget = '0' } = req.body;

        // Filter accommodation based on criteria
        const filteredAccommodation = accommodationData.filter(acc => {
            const locationMatch = !location || acc.location.toLowerCase().includes(location.toLowerCase());
            const budgetMatch = !budget || acc.rent <= parseInt(budget || '0') * 0.4; // Assuming rent should be max 40% of budget

            return locationMatch && budgetMatch;
        });

        // If no results, return all accommodation
        const results = filteredAccommodation.length > 0 ? filteredAccommodation : accommodationData;

        // Sort by distance to university and take top 5
        const sortedResults = results
            .sort((a, b) => parseInt(a.distanceToCampus) - parseInt(b.distanceToCampus))
            .slice(0, 5);

        res.status(200).json({ data: sortedResults });
    } catch (error) {
        console.error('Error in accommodation API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
