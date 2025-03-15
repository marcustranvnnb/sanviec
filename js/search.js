document.addEventListener("DOMContentLoaded", function () {
    let jobsData = []; // Store the fetched jobs data

    // Fetch jobs data from jobs.json
    fetch('../data/jobs.json')
        .then(response => response.json())
        .then(data => {
            jobsData = data; // Store the data
            applyFilters(); // Apply filters and sort on page load
        })
        .catch(error => console.error('Error loading JSON data:', error));

    // Function to apply filters and sorting
    function applyFilters() {
        const queryParams = new URLSearchParams(window.location.search);
        const searchQuery = queryParams.get('search') || '';
        const jobTypeFilter = queryParams.get('jobtype') || 'all';
        const workingTypeFilter = queryParams.get('workingtype') || 'all';

        // Filter jobs based on the search query and optional filters
        const filteredJobs = filterJobs(searchQuery, jobTypeFilter, workingTypeFilter, jobsData);

        // Sort jobs based on the selected option
        const sortOption = document.getElementById('sort').value;
        const sortedJobs = sortJobs(filteredJobs, sortOption);

        displayJobs(sortedJobs); // Display filtered and sorted jobs
    }

    // Function to filter jobs
    function filterJobs(query, jobType, workingType, jobs) {
        return jobs.filter(job => {
            const matchesSearchQuery = (
                job.jobTitle.toLowerCase().includes(query.toLowerCase()) ||
                job.company.toLowerCase().includes(query.toLowerCase()) ||
                job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
            );

            const matchesJobType = jobType === 'all' || job.jobType.toLowerCase() === jobType.toLowerCase();
            const matchesWorkingType = workingType === 'all' || job.workingType.toLowerCase() === workingType.toLowerCase();

            return matchesSearchQuery && matchesJobType && matchesWorkingType;
        });
    }

    // Function to sort jobs
    function sortJobs(jobs, sortOption) {
        if (sortOption === 'most-recent') {
            // Sort by postedDate (newest first)
            return jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        } else if (sortOption === 'relevance') {
            // Sort by relevance (e.g., number of matching skills or search query)
            return jobs.sort((a, b) => {
                const aRelevance = a.skills.length; // Example: Use number of skills as relevance
                const bRelevance = b.skills.length;
                return bRelevance - aRelevance;
            });
        }
        return jobs; // Default: no sorting
    }

    // Function to display jobs
    function displayJobs(jobs) {
        const jobContainer = document.getElementById('job-container');
        jobContainer.innerHTML = ''; // Clear previous results

        if (jobs.length === 0) {
            jobContainer.innerHTML = '<p>Không tìm thấy công việc phù hợp.</p>';
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
            workingType.textContent = `Hình thức làm việc: ${job.workingType}`;

            const jobType = document.createElement('div');
            jobType.className = 'job-type';
            jobType.textContent = `Loại hình công việc: ${job.jobType}`;

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
            postedDate.textContent = `Ngày đăng: ${job.postedDate}`;

            const applyLink = document.createElement('a');
            applyLink.className = 'apply-link';
            applyLink.href = job.applicationLink;
            applyLink.textContent = 'Ứng tuyển ngay';

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

    // Add event listener to the sorting dropdown
    const sortDropdown = document.getElementById('sort');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', function () {
            applyFilters(); // Reapply filters and sorting when the dropdown changes
        });
    }
});