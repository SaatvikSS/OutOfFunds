const data = require('./data/accommodation.json');
const accommodationData = data.accommodation;

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { location, budget } = req.body;

        // Filter accommodation based on criteria
        const filteredAccommodation = accommodationData.filter(acc => {
            return acc.location.toLowerCase().includes(location.toLowerCase()) &&
                   acc.rent <= parseInt(budget) * 0.4; // Assuming rent should be max 40% of budget
        });

        // Sort by distance to university
        const sortedAccommodation = filteredAccommodation.sort((a, b) => 
            parseInt(a.distanceToCampus) - parseInt(b.distanceToCampus)
        );

        // Take top 5 results
        const results = sortedAccommodation.slice(0, 5);

        res.status(200).json({ data: results });
    } catch (error) {
        console.error('Error in accommodation API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
