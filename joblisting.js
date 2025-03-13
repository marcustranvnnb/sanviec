document.addEventListener("DOMContentLoaded", function () {
  const jobsJsonUrl = 'jobs.json'; // Path to the jobs.json file


  let jobs = []; // Array to hold job data

  // DOM Elements
  const searchInput = document.getElementById("search");
  const workplaceTypeSelect = document.getElementById("workplace-type");
  const jobTypeSelect = document.getElementById("job-type");
  const countrySelect = document.getElementById("country");
  const searchButton = document.getElementById("search-button");
  const loadingDiv = document.getElementById("loading");
  const errorDiv = document.getElementById("error");
  const noResultsDiv = document.getElementById("no-results");
  const jobListingsDiv = document.getElementById("job-listings");
  const totalJobsSpan = document.getElementById("total-jobs");
  const sortBySelect = document.getElementById("sort-by");
  const jobDetailOverlay = document.getElementById("job-detail-overlay");
  const jobDetailContainer = document.getElementById("job-detail-container");

  // Fetch and display jobs
  async function fetchJobs() {
    const loadingDiv = document.getElementById("loading");
    const errorDiv = document.getElementById("error");
    const noResultsDiv = document.getElementById("no-results");
    const jobListingsDiv = document.getElementById("job-listings");

    // Debugging: Check if elements exist
    if (!loadingDiv || !errorDiv || !noResultsDiv || !jobListingsDiv) {
        console.error("One or more required elements are missing in the DOM!");
        return;
    }

    loadingDiv.style.display = "block"; // Show loading state
    errorDiv.style.display = "none"; // Hide error message
    noResultsDiv.style.display = "none"; // Hide no results message
    jobListingsDiv.innerHTML = ""; // Clear existing job listings

    try {
        // Fetch jobs from jobs.json
        const response = await fetch(jobsJsonUrl);

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            throw new Error(`Failed to fetch jobs. Status: ${response.status}`);
        }

        // Parse the JSON data
        const jsonJobs = await response.json();

        // Check if the parsed data is an array
        if (!Array.isArray(jsonJobs)) {
            throw new Error("Invalid JSON format: Expected an array of jobs.");
        }

        // Store the jobs in the global `jobs` array
        jobs = jsonJobs;

        // Sort jobs by "Posted Date" in descending order (most recent first)
        if (jobs.length > 0) {
            sortJobs("most-recent");
        }

        // Render the jobs
        renderJobs(jobs);
    } catch (error) {
        console.error("Error fetching or parsing jobs:", error);
        errorDiv.style.display = "block"; // Show error message
        errorDiv.textContent = "Không thể tải công việc. Vui lòng thử lại sau."; // Set error message text
    } finally {
        loadingDiv.style.display = "none"; // Hide loading state
    }
}

  // Render all jobs at once
  function renderJobs(jobsToRender) {
      if (jobsToRender.length === 0) {
          noResultsDiv.style.display = "block";
          jobListingsDiv.innerHTML = "";
      } else {
          noResultsDiv.style.display = "none";
          jobListingsDiv.innerHTML = jobsToRender.map(createJobCard).join(""); // Render all jobs
          totalJobsSpan.textContent = jobsToRender.length; // Update the total jobs display
      }

      // Add click event listeners to job cards
      document.querySelectorAll(".card__btn").forEach((button) => {
          button.addEventListener("click", (event) => {
              event.stopPropagation(); // Prevent event bubbling
              const jobId = button.closest(".e-card").dataset.jobId;
              showJobDetail(jobId);
          });
      });
  }

  // Create job card HTML with the new structure
  function createJobCard(job) {
      const skills = Array.isArray(job.Skills) ? job.Skills : [job.Skills || "Not specified"];
      return `
          <article class="e-card" data-job-id="${job.JobID}">
              <div class="wave"></div>
              <div class="wave"></div>
              <div class="wave"></div>
              <section class="card__hero">
                  <header class="card__hero-header">
                      <span class="working-type">${job["Working Type"] || "Not specified"}</span>
                      <div class="icon">
                          <svg
                              height="20"
                              width="20"
                              stroke="currentColor"
                              stroke-width="1.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                          >
                              <path
                                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                  stroke-linejoin="round"
                                  stroke-linecap="round"
                              ></path>
                          </svg>
                      </div>
                  </header>
                  <p class="infotop">${job["Job Title"]}</p>
                  <p class="name">${job.Company}</p>
                  <p class="card__job-summary">${job["Job Summary"]}</p>
                  <div class="card__skill-tags">
                      ${skills.map((skill) => `<span>${skill}</span>`).join("")}
                  </div>
              </section>
              <footer class="card__footer">
                  <button class="card__btn">Xem thêm</button>
              </footer>
          </article>
      `;
  }

  // Show job detail overlay
  function showJobDetail(jobId) {
      const job = jobs.find((job) => job.JobID === jobId);
      if (job) {
          const industry = Array.isArray(job.Industry) ? job.Industry.join(", ") : "Not specified";
          jobDetailContainer.innerHTML = `
              <span class="close-btn">&times;</span>
              <h2>${job["Job Title"]}</h2>
              <p><strong>Company:</strong> ${job.Company}</p>
              <p><strong>Location:</strong> ${job.Location}</p>
              <p><strong>Working Type:</strong> ${job["Working Type"] || "Not specified"}</p>
              <p><strong>Industry:</strong> ${industry}</p>
              <p><strong>Skills:</strong> ${job.Skills.join(", ")}</p>
              <p><strong>Job Type:</strong> ${job["Job Type"]}</p>
              <p><strong>Job Description:</strong></p>
              <div class="job-description">${formatJobDescription(job["Job Description"])}</div>
              <div class="apply-button">
                  <a href="${job["Application Link"]}" target="_blank">Apply Now</a>
              </div>
          `;
          jobDetailOverlay.style.display = "flex";

          // Add event listener to close button
          jobDetailContainer.querySelector(".close-btn").addEventListener("click", () => {
              jobDetailOverlay.style.display = "none";
          });

          // Close overlay when clicking outside the job detail container
          jobDetailOverlay.addEventListener("click", (e) => {
              if (e.target === jobDetailOverlay) {
                  jobDetailOverlay.style.display = "none";
              }
          });
      }
  }

  // Function to format job description with bold, italic, and bullet points
  function formatJobDescription(description) {
      // Replace **text** with <strong>text</strong> for bold
      description = description.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Replace *text* with <em>text</em> for italic
      description = description.replace(/\*(.*?)\*/g, "<em>$1</em>");
      // Replace - with <li> for bullet points
      description = description.replace(/^- (.*)/gm, "<li>$1</li>");
      // Wrap bullet points in <ul>
      if (description.includes("<li>")) {
          description = `<ul>${description}</ul>`;
      }
      return description;
  }

  // Filter jobs based on search term and filters
  function filterJobs() {
      const searchTerm = searchInput.value.toLowerCase();
      const workplaceType = workplaceTypeSelect.value;
      const jobType = jobTypeSelect.value;
      const country = countrySelect.value;

      const filteredJobs = jobs.filter((job) => {
          const matchesSearch =
              job["Job Title"].toLowerCase().includes(searchTerm) ||
              job["Job Description"].toLowerCase().includes(searchTerm) ||
              job.Company.toLowerCase().includes(searchTerm) ||
              job.Location.toLowerCase().includes(searchTerm);
          const matchesWorkplaceType = workplaceType ? job["Working Type"] === workplaceType : true;
          const matchesJobType = jobType ? job["Job Type"] === jobType : true;
          const matchesCountry = country ? job["Country"] === country : true;
          return matchesSearch && matchesWorkplaceType && matchesJobType && matchesCountry;
      });

      jobListingsDiv.innerHTML = ""; // Clear existing jobs
      renderJobs(filteredJobs); // Render filtered jobs
  }

  // Sort jobs
  function sortJobs(sortBy) {
      switch (sortBy) {
          case "most-recent":
              jobs.sort((a, b) => new Date(b["Posted Date"]) - new Date(a["Posted Date"]));
              break;
          case "oldest":
              jobs.sort((a, b) => new Date(a["Posted Date"]) - new Date(b["Posted Date"]));
              break;
          case "highest-salary":
              // Assuming salary is stored in a "Salary" field
              jobs.sort((a, b) => (b.Salary || 0) - (a.Salary || 0));
              break;
          case "least-experience":
              // Assuming experience is stored in an "Experience" field
              jobs.sort((a, b) => (a.Experience || 0) - (b.Experience || 0));
              break;
          default:
              // Default to most recent
              jobs.sort((a, b) => new Date(b["Posted Date"]) - new Date(a["Posted Date"]));
      }
      jobListingsDiv.innerHTML = ""; // Clear existing jobs
      renderJobs(jobs); // Render sorted jobs
  }

  // Event listeners
  if (searchButton) searchButton.addEventListener("click", filterJobs);
  if (sortBySelect) sortBySelect.addEventListener("change", () => sortJobs(sortBySelect.value));

  // Initial fetch
  fetchJobs();
});
