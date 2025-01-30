const data = require('./data/jobs.json');
const jobsData = data.jobs;

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { location = '', budget = '0', studyLevel = '' } = req.body;

        // Filter jobs based on criteria
        const filteredJobs = jobsData.filter(job => {
            const locationMatch = !location || job.location.toLowerCase().includes(location.toLowerCase());
            const budgetMatch = !budget || job.salary <= parseInt(budget || '0');
            const levelMatch = !studyLevel || job.requirements.toLowerCase().includes(studyLevel.toLowerCase());

            return locationMatch && budgetMatch && levelMatch;
        });

        // If no results, return all jobs
        const results = filteredJobs.length > 0 ? filteredJobs : jobsData;

        // Sort by salary and take top 5
        const sortedResults = results.sort((a, b) => b.salary - a.salary).slice(0, 5);

        res.status(200).json({ data: sortedResults });
    } catch (error) {
        console.error('Error in jobs API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
