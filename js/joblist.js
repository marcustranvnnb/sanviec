document.addEventListener("DOMContentLoaded", function () {
    let jobsData = []; // Store the fetched jobs data

    // Fetch jobs data from jobs.json
    fetch('../data/jobs.json')
        .then(response => response.json())
        .then(data => {
            jobsData = data; // Store the data
            displayJobs(jobsData); // Display all jobs by default
        })
        .catch(error => console.error('Error loading JSON data:', error));

    // Function to display jobs
    function displayJobs(jobs) {
        const jobContainer = document.getElementById('job-container');
        jobContainer.innerHTML = ''; // Clear previous results

        if (jobs.length === 0) {
            jobContainer.innerHTML = '<p>No jobs found.</p>'; // Show a message if no jobs match
            return;
        }

        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';

            const jobTitle = document.createElement('div');
            jobTitle.className = 'job-title';
            jobTitle.textContent = job.jobTitle;

            const company = document.createElement('div');
            company.className = 'company';
            company.textContent = job.company;

            const workingType = document.createElement('div');
            workingType.className = 'working-type';
            workingType.textContent = `Working Type: ${job.workingType}`;

            const jobType = document.createElement('div');
            jobType.className = 'job-type';
            jobType.textContent = `Job Type: ${job.jobType}`;

            const skills = document.createElement('div');
            skills.className = 'skills';
            job.skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill;
                skills.appendChild(skillTag);
            });

            const postedDate = document.createElement('div');
            postedDate.className = 'posted-date';
            postedDate.textContent = `Posted on: ${job.postedDate}`;

            const applyLink = document.createElement('a');
            applyLink.className = 'apply-link';
            applyLink.href = job.applicationLink;
            applyLink.textContent = 'Apply Now';

            jobCard.appendChild(jobTitle);
            jobCard.appendChild(company);
            jobCard.appendChild(workingType);
            jobCard.appendChild(jobType);
            jobCard.appendChild(skills);
            jobCard.appendChild(postedDate);
            jobCard.appendChild(applyLink);

            jobContainer.appendChild(jobCard);
        });
    }

    // Search functionality
    const searchForm = document.querySelector('header form');
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission
        const searchInput = document.querySelector('header input[name="search"]').value.trim().toLowerCase();

        if (!searchInput) {
            displayJobs(jobsData); // If search input is empty, show all jobs
            return;
        }

        const filteredJobs = jobsData.filter(job => {
            // Check if the job title, company, or skills match the search input
            return (
                job.jobTitle.toLowerCase().includes(searchInput) ||
                job.company.toLowerCase().includes(searchInput) ||
                job.skills.some(skill => skill.toLowerCase().includes(searchInput))
            );
        });

        displayJobs(filteredJobs); // Display filtered jobs
    });

    // Filter functionality (job type and working type)
    const jobTypeFilter = document.querySelector('header select[name="jobtype"]');
    const workingTypeFilter = document.querySelector('header select[name="workingtype"]');

    jobTypeFilter.addEventListener('change', applyFilters);
    workingTypeFilter.addEventListener('change', applyFilters);

    function applyFilters() {
        const selectedJobType = jobTypeFilter.value;
        const selectedWorkingType = workingTypeFilter.value;

        const filteredJobs = jobsData.filter(job => {
            const matchesJobType = selectedJobType === 'all' || job.jobType.toLowerCase() === selectedJobType.toLowerCase();
            const matchesWorkingType = selectedWorkingType === 'all' || job.workingType.toLowerCase() === selectedWorkingType.toLowerCase();
            return matchesJobType && matchesWorkingType;
        });

        displayJobs(filteredJobs); // Display filtered jobs
    }
});