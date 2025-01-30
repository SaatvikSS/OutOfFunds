const data = require('./data/jobs.json');
const jobsData = data.jobs;

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { location, budget, studyLevel } = req.body;

        // Filter jobs based on criteria
        const filteredJobs = jobsData.filter(job => {
            return job.location.toLowerCase().includes(location.toLowerCase()) &&
                   job.salary <= parseInt(budget) &&
                   job.requirements.toLowerCase().includes(studyLevel.toLowerCase());
        });

        // Sort by salary
        const sortedJobs = filteredJobs.sort((a, b) => b.salary - a.salary);

        // Take top 5 results
        const results = sortedJobs.slice(0, 5);

        res.status(200).json({ data: results });
    } catch (error) {
        console.error('Error in jobs API:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
