document.addEventListener("DOMContentLoaded", function () {
    const jobAlertForm = document.getElementById('job-alert-form');
    if (jobAlertForm) {
        jobAlertForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('job-alert-email').value;
            const jobType = document.getElementById('job-alert-type').value;
            const location = document.getElementById('job-alert-location').value;

            // Save job alert preferences (this could be sent to a backend service)
            localStorage.setItem('job-alert-email', email);
            localStorage.setItem('job-alert-type', jobType);
            localStorage.setItem('job-alert-location', location);

            alert('Job alert set successfully!');
        });
    }
});