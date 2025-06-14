fetch("/userdetails")
    .then(response => response.json())
    .then(data => {
        if (data.user) {
            let user = data.user;
            document.getElementById("username").innerHTML = user.username || "No user data found";
            document.getElementById("userName").innerHTML = user.username || "No user data found";
            document.getElementById("firstName").innerHTML = user.firstname || "No user data found";
            document.getElementById("secondName").innerHTML = user.secondname || "No user data found";
            document.getElementById("gender").innerHTML = user.gender || "No user data found";
            document.getElementById("emailAcc").innerHTML = user.email || "No user data found";
        } else {
            document.getElementById("errors").innerHTML = "No user data fetched please login"
        }
    })
    .catch(error => console.error("Error fetching user details:", error));

function typeText(element, text, time, callback) {
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent = text.slice(0, index + 1) + "|";
            index++;
            setTimeout(type, time);
        } else {
            element.textContent = text;
            if (callback) callback();
        }
    }

    type();
};

const tittleEl = document.getElementById("tittle");
typeText(tittleEl, "Resume Maker", 300);

function toggleDropdown(id) {
    $(".dashboard-menu-items-item-dropdown").not("#" + id).removeClass("active");
    $("#" + id).toggleClass("active");
}


document.addEventListener("DOMContentLoaded", function () {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('pdfFile');

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', event => {
        event.preventDefault();
        dropZone.style.borderColor = "blue";
    });
    dropZone.addEventListener('dragleave', () => dropZone.style.borderColor = "#ccc");
    dropZone.addEventListener('drop', event => {
        event.preventDefault();
        dropZone.style.borderColor = "#ccc";
        const file = event.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        if (file) handleFile(file);
    });

    function handleFile(file) {
        console.log("File selected:", file.name);
        dropZone.textContent = `Selected: ${file.name}`;
        dropZone.style.border = "solid #ffffff";
        dropZone.style.color = "#ffffff";

    }
});

let blinkInterval = null;
let loadingInProgress = false;

function display(sectionId) {
    const allSections = [
        "sectionDashboardContainer",
        "sectionLoader1",
        "sectionGenerateResume",
        "sectionTemplets",
        "sectionLoader2",
        "sectionAccount"
    ];

    allSections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.style.display = "block";

    const dashboardMenu = document.querySelector(".dashboard-menu-container");
    if (dashboardMenu) {
        if (sectionId === "sectionLoader1" || sectionId === "sectionLoader2") {
            dashboardMenu.style.display = "none";
        } else {
            dashboardMenu.style.display = "block";
        }
    }

    // Reset loader-specific UI and logic
    if (sectionId === "sectionLoader1" || sectionId === "sectionLoader2") {
        // Clear any previous blinking intervals
        if (blinkInterval) clearInterval(blinkInterval);

        // Handle blinking dots
        const blinkElement = document.querySelector(`#${sectionId} #blink`);
        let dots = 0;
        blinkInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            if (blinkElement) {
                blinkElement.textContent = '.'.repeat(dots);
            }
        }, 500);

        // Prevent stacking loadAndTick processes
        if (loadingInProgress) return;
        loadingInProgress = true;

        // Load and tick animation
        let num = 1;
        function loadAndTick() {
            if (num > 4) {
                // Show the final action button
                if (sectionId === "sectionLoader1") {
                    const btn = document.getElementById("getStartedBtn");
                    if (btn) btn.style.display = "block";
                } else {
                    const btn = document.getElementById("chooseTemplatesBtn");
                    if (btn) btn.style.display = "block";
                }
                loadingInProgress = false;
                return;
            }

            setTimeout(() => {
                const loadEl = document.querySelector(`#${sectionId} #load${num}`);
                const tickEl = document.querySelector(`#${sectionId} #tick${num}`);

                if (loadEl) loadEl.style.display = "block";
                if (tickEl) {
                    setTimeout(() => {
                        tickEl.classList.add("checked");
                        num++;
                        loadAndTick(); // Continue the sequence
                    }, 2000);
                } else {
                    // If element not found, just move on
                    num++;
                    loadAndTick();
                }
            }, 1000);
        }

        loadAndTick();
    }


    // Special case for hiding dashboard when opening templates
    if (sectionId === "sectionTemplets") {
        const dashboard = document.getElementById("sectionDashboard");
        if (dashboard) dashboard.style.display = "none";
    }
}

// function for the skills sections
document.addEventListener("DOMContentLoaded", function () {
    // Soft skills elements
    const softDropdown = document.querySelector(".soft-skills-dropdown");
    const softSearchInput = document.querySelector(".soft-skills-search");
    const softCheckboxList = document.querySelectorAll("#soft-checkbox-list label");
    const softCheckboxes = document.querySelectorAll("#soft-checkbox-list input[type='checkbox']");
    const softSelectedOptionsDiv = document.querySelector(".soft-selected-options");

    // Technical skills elements
    const techDropdown = document.querySelector(".technical-skills-dropdown");
    const techSearchInput = document.querySelector(".technical-skills-search");
    const techCheckboxList = document.querySelectorAll("#technical-checkbox-list label");
    const techCheckboxes = document.querySelectorAll("#technical-checkbox-list input[type='checkbox']");
    const techSelectedOptionsDiv = document.querySelector(".technical-selected-options");

    // Soft Skills functions
    window.toggleSoftSkillsDropdown = function () {
        softDropdown.style.display = softDropdown.style.display === "block" ? "none" : "block";
        if (softDropdown.style.display === "block") softSearchInput.focus();
    };
    window.filterSoftOptions = function () {
        const filter = softSearchInput.value.toLowerCase();
        softCheckboxList.forEach(label => {
            label.style.display = label.textContent.toLowerCase().includes(filter) ? "block" : "none";
        });
    };
    function updateSoftSelectedOptions() {
        const selected = [];
        softCheckboxes.forEach(cb => {
            if (cb.checked) selected.push(`<span>${cb.parentElement.textContent.trim()} <span class="remove" onclick="removeSoftSelection('${cb.value}')">&times;</span></span>`);
        });
        softSelectedOptionsDiv.innerHTML = selected.length ? selected.join(" ") : "Select Soft Skills";
    }
    window.removeSoftSelection = function (value) {
        softCheckboxes.forEach(cb => {
            if (cb.value === value) cb.checked = false;
        });
        updateSoftSelectedOptions();
    };
    softCheckboxes.forEach(cb => cb.addEventListener("change", updateSoftSelectedOptions));

    // Technical Skills functions
    window.toggleTechnicalSkillsDropdown = function () {
        techDropdown.style.display = techDropdown.style.display === "block" ? "none" : "block";
        if (techDropdown.style.display === "block") techSearchInput.focus();
    };
    window.filterTechnicalOptions = function () {
        const filter = techSearchInput.value.toLowerCase();
        techCheckboxList.forEach(label => {
            label.style.display = label.textContent.toLowerCase().includes(filter) ? "block" : "none";
        });
    };
    function updateTechnicalSelectedOptions() {
        const selected = [];
        techCheckboxes.forEach(cb => {
            if (cb.checked) selected.push(`<span>${cb.parentElement.textContent.trim()} <span class="remove" onclick="removeTechnicalSelection('${cb.value}')">&times;</span></span>`);
        });
        techSelectedOptionsDiv.innerHTML = selected.length ? selected.join(" ") : "Select Technical Skills";
    }
    window.removeTechnicalSelection = function (value) {
        techCheckboxes.forEach(cb => {
            if (cb.value === value) cb.checked = false;
        });
        updateTechnicalSelectedOptions();
    };
    techCheckboxes.forEach(cb => cb.addEventListener("change", updateTechnicalSelectedOptions));

    // Close dropdowns when clicking outside
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".soft-dropdown-container")) {
            softDropdown.style.display = "none";
        }
        if (!event.target.closest(".technical-dropdown-container")) {
            techDropdown.style.display = "none";
        }
    });

    // Initialize displays
    updateSoftSelectedOptions();
    updateTechnicalSelectedOptions();
});

const jobroleList = [
    "Frontend Developer", "Backend Developer", "FullStack Developer", "UI/UX Designer",
    "QA Engineer", "Project Manager", "DevOps Engineer", "Data Analyst",
    "Python Developer", "Java Developer", "JavaScript Developer", "TypeScript Developer",
    "C++ Developer", "C# Developer", "PHP Developer", "Go Developer", "Ruby Developer",
    "Kotlin Developer", "Swift Developer", "Mobile App Developer", "iOS Developer",
    "Android Developer", "Cloud Engineer", "Site Reliability Engineer", "Machine Learning Engineer",
    "AI Engineer", "Data Engineer", "Security Engineer", "Blockchain Developer",
    "Game Developer", "AR/VR Developer", "Software Engineer", "Electrical Engineer",
    "Mechanical Engineer", "Civil Engineer", "Electronics Engineer", "Chemical Engineer",
    "Biomedical Engineer", "Environmental Engineer", "Industrial Engineer", "Aerospace Engineer",
    "Structural Engineer"
];

const input = document.getElementById('jobrole');
const dropdown = document.getElementById('jobroleDropdown');

input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    dropdown.innerHTML = '';

    if (query.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    const filteredRoles = jobroleList.filter(role =>
        role.toLowerCase().includes(query)
    );

    if (filteredRoles.length === 0) {
        dropdown.style.display = 'none';
        return;
    }

    filteredRoles.forEach(role => {
        const div = document.createElement('div');
        div.textContent = role;
        div.addEventListener('click', () => {
            input.value = role;
            dropdown.style.display = 'none';
        });
        dropdown.appendChild(div);
    });

    dropdown.style.display = 'block';
});

// Hide dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) {
        dropdown.style.display = 'none';
    }
});

const selects = document.querySelectorAll("select");

selects.forEach(select => {
    select.addEventListener("change", function () {
        if (this.value !== "") {
            this.style.color = "#000";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // ======== REMOVE FUNCTION (all sections) ==========
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("remove-entry")) {
            const entry = e.target.closest("div");
            const container = entry?.parentElement;
            if (!container) return;

            entry.remove();

            if (container.id === "projectsContainer") reindexProjects();
            else if (container.id === "certificatesContainer") reindexCertificates();
            else if (container.classList.contains("experincesContainer")) reindexExperiences();
            else if (container.id === "achievementsContainer") reindexAchievements();
        }
    });

    // ========== ADD PROJECT ==========
    document.getElementById("addProjectButton").addEventListener("click", function () {
        const container = document.getElementById("projectsContainer");
        const count = container.children.length;

        const div = document.createElement("div");
        div.className = "project-entry d-flex flex-column justify-content-start mb-4";
        div.innerHTML = `
            <label>Project${count + 1}<span style="color:red;">*</span>:</label>
            <input type="text" name="projects[${count}][name]" placeholder="Project name" required><br>
            <input type="text" name="projects[${count}][link]" placeholder="Project link" required><br>
            <textarea name="projects[${count}][description]" placeholder="Project description" required></textarea>
            <button type="button" class="remove-entry btn form-button">Remove</button>
        `;
        container.appendChild(div);
    });

    // ========== ADD CERTIFICATE ==========
    document.getElementById("addCertificateButton").addEventListener("click", function () {
        const container = document.getElementById("certificatesContainer");
        const count = container.children.length;

        const div = document.createElement("div");
        div.className = "certificate-entry d-flex flex-column justify-content-start mb-4";
        div.innerHTML = `
            <label style="font-size: 14px; font-weight: 700; color: black;">Certificate${count + 1}<span style="color:red;">*</span>:</label>
            <input type="text" name="certificates[${count}][name]" placeholder="Certificate name" required><br>
            <input type="text" name="certificates[${count}][link]" placeholder="Certificate link" required><br>
            <button type="button" class="remove-entry btn form-button">Remove</button>
        `;
        container.appendChild(div);
    });

    // ========== ADD EXPERIENCE ==========
    document.getElementById("addExperinceButton").addEventListener("click", function () {
        const container = document.querySelector(".experincesContainer");
        const count = container.children.length;

        const div = document.createElement("div");
        div.className = "experience-entry d-flex flex-column justify-content-start mb-4";
        div.innerHTML = `
            <label style="font-size: 14px; font-weight: 700; color: black;">Experience${count + 1}<span style="color:red;">*</span>:</label>
            <input type="text" name="experiences[${count}][title]" placeholder="Job Title" required><br>
            <input type="text" name="experiences[${count}][company]" placeholder="Company" required><br>
            <input type="text" name="experiences[${count}][jobRole]" placeholder="Job Role" required><br>
            <div class="d-flex flex-row justify-content-start mb-4">
                <label class="mr-2">Start date<span style="color:red;">*</span>:</label>
                <input type="date" name="experiences[${count}][startDate]" class="mr-4" required><br>
                <label class="mr-2">End date<span style="color:red;">*</span>:</label>
                <input type="date" name="experiences[${count}][endDate]" required><br>
            </div>
            <textarea name="experiences[${count}][description]" placeholder="Description" required></textarea><br>
            <button type="button" class="remove-entry btn form-button">Remove</button>
        `;
        container.appendChild(div);
    });

    // ========== ADD ACHIEVEMENT ==========
    document.getElementById("addAchievementButton").addEventListener("click", function () {
        const container = document.getElementById("achievementsContainer");
        const count = container.children.length;

        const div = document.createElement("div");
        div.className = "achievement-entry d-flex flex-column justify-content-start mb-4";
        div.innerHTML = `
            <label style="font-size: 14px; font-weight: 700; color: black;">Achievement${count + 1}<span style="color:red;">*</span>:</label>
            <input type="text" name="achievements[${count}]" placeholder="Achievement" required><br>
            <button type="button" class="remove-entry btn form-button">Remove</button>
        `;
        container.appendChild(div);
    });

    // ========== Reindex Functions ==========
    function reindexProjects() {
        const container = document.getElementById("projectsContainer");
        [...container.children].forEach((entry, i) => {
            entry.querySelector("label").innerHTML = `Project${i + 1}<span style="color:red;">*</span>:`;
            entry.querySelectorAll("input, textarea").forEach(input => {
                input.name = input.name.replace(/projects\[\d+\]/, `projects[${i}]`);
            });
        });
    }

    function reindexCertificates() {
        const container = document.getElementById("certificatesContainer");
        [...container.children].forEach((entry, i) => {
            entry.querySelector("label").innerHTML = `Certificate${i + 1}<span style="color:red;">*</span>:`;
            entry.querySelectorAll("input").forEach(input => {
                input.name = input.name.replace(/certificates\[\d+\]/, `certificates[${i}]`);
            });
        });
    }

    function reindexExperiences() {
        const container = document.querySelector(".experincesContainer");
        [...container.children].forEach((entry, i) => {
            entry.querySelector("label").innerHTML = `Experience${i + 1}<span style="color:red;">*</span>:`;
            entry.querySelectorAll("input, textarea").forEach(input => {
                input.name = input.name.replace(/experiences\[\d+\]/, `experiences[${i}]`);
            });
        });
    }

    function reindexAchievements() {
        const container = document.getElementById("achievementsContainer");
        [...container.children].forEach((entry, i) => {
            entry.querySelector("label").innerHTML = `Achievement${i + 1}<span style="color:red;">*</span>:`;
            entry.querySelector("input").name = `achievements[${i}]`;
        });
    }
});


const templates = {
    template1: (resumeData) => `
            <div class="resume-container" style="font-family: Arial, sans-serif;">
    <div class="resume-header text-center">
        <h1 id="name">${resumeData.fullname}</h1>
        <p style="margin-top: -10px;">
            <strong>Email:</strong> <a href="mailto:${resumeData.email}" target="_blank">${resumeData.email}</a> 
            <strong> Phone:</strong> ${resumeData.phone_number}
        </p>
        <p style="margin-top: -15px;">
            <strong>LinkedIn:</strong> <a href="${resumeData.linkedin_link}" target="_blank">${resumeData.linkedin_link}</a>
        </p>
    </div>

    <div class="resume-section">
        <h5 style="margin-top: -6px;"><strong>Summary</strong></h5>
        <p>
            Dedicated ${resumeData.job_role} seeking a challenging position in a reputed organization where I can learn new skills, 
            expand my knowledge, and leverage my learnings to get an opportunity where I can make the best of my potential 
            and contribute to both my and the organization's growth.
        </p>
    </div>

    <div class="resume-section">
        <h5><strong>Education</strong></h5>
        <div class="education-container">
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.college_name}</p>
                    <p>${resumeData.college_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.college_degree} (${resumeData.college_course})</p>
                    <p>${resumeData.college_marks}</p>
                </div>
            </div>
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.intermediate_name}</p>
                    <p>${resumeData.intermediate_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.intermediate_degree} (${resumeData.intermediate_course})</p>
                    <p>${resumeData.intermediate_marks}</p>
                </div>
            </div>
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.school_name}</p>
                    <p>${resumeData.school_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.school_degree}</p>
                    <p>${resumeData.school_marks}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5><strong>Experience</strong></h5>
            ${resumeData.experiences?.map(experience => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong>${experience.title}</strong></p>
                        <p><strong>${experience.startDate} - ${experience.endDate}</strong></p>
                    </div>
                    <p>In this my role is ${experience.jobRole}, ${experience.description}</p>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Projects</strong></h5>
            ${resumeData.projects?.map(project => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong>${project.name}</strong> 
                            (<a href="${project.link}" target="_blank">${project.link}</a>)
                        </p>
                    </div>
                    <p>${project.description}</p>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section mb-2">
            <h5 class="spl-head" style="margin-top:-25px;"><strong>Certificates</strong></h5>
            <div class="resume-section-bigdata">
                <ul class="resume-section-bigdata-title-card">
            ${resumeData.certificates?.map(certificate => `
                  <li><strong><a href="${certificate.link}" target="_blank">${certificate.name}</a></strong></li>
            `).join('') || ' '}
                </ul>
            </div>
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Achievements</strong></h5>
            <ul>
                ${resumeData.achievements?.map(achievement => `<li>${achievement}</li>`).join('') || ' '}
            </ul>
        </div>
    </div>

    <div class="resume-section d-flex flex-column justify-content-start">
        <div class="skills-section">
            <p style="padding-right: 5px; font-size: 16px;"><strong>Soft skills: </strong></p>
            <p>${resumeData.softskills?.join(', ') || ''}</p>
        </div>
        <div class="skills-section" style="margin-top: -7px;">
            <p style="padding-right: 5px; font-size: 16px;"><strong>Technical skills: </strong></p>
            <p>${resumeData.technicalskills?.join(', ') || ''}</p>
        </div>
    </div>
</div>

        `,
    template2: (resumeData) => `
            <div class="resume-container" style="font-family: Arial, sans-serif;">
    <div class="resume-header text-center">
        <h1>${resumeData.fullname}</h1>
        <p style="margin-top: -10px;">
            <strong>Email:</strong> <a href="mailto:${resumeData.email}" target="_blank">${resumeData.email}</a> 
            <strong>Mobile:</strong> ${resumeData.phone_number}
        </p>
        <p style="margin-top: -15px;">
            <strong>LinkedIn:</strong> <a href="${resumeData.linkedin_link}" target="_blank">${resumeData.linkedin_link}</a>
        </p>
    </div>

    <div class="resume-section">
        <h5 style="margin-top: -6px;"><strong>Summary</strong></h5>
        <p>
            Dedicated ${resumeData.job_role} seeking a challenging position in a reputed organization where I can learn new skills, 
            expand my knowledge, and leverage my learnings to get an opportunity where I can make the best of my potential 
            and contribute to both my and the organization's growth.
        </p>
    </div>

    <div class="resume-section">
        <h5><strong>Education</strong></h5>
        <div class="education-container">
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.college_name}</p>
                    <p>${resumeData.college_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.college_degree} (${resumeData.college_course})</p>
                    <p>${resumeData.college_marks} CGPA/Marks</p>
                </div>
            </div>
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.intermediate_name}</p>
                    <p>${resumeData.intermediate_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.intermediate_degree} (${resumeData.intermediate_course})</p>
                    <p>${resumeData.intermediate_marks}</p>
                </div>
            </div>
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.school_name}</p>
                    <p>${resumeData.school_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.school_degree}</p>
                    <p>${resumeData.school_marks} CGPA/Marks</p>
                </div>
            </div>
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5><strong>Experience</strong></h5>
            ${resumeData.experiences?.map(experience => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong>${experience.title}</strong></p>
                        <p><strong>${experience.startDate} - ${experience.endDate}</strong></p>
                    </div>
                    <p>In this my role is ${experience.jobRole}, ${experience.description}</p>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Projects</strong></h5>
            ${resumeData.projects?.map(project => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong>${project.name}</strong> 
                            <a href="${project.link}" target="_blank">(${project.link})</a>
                        </p>
                    </div>
                    <p>${project.description}</p>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Achievements</strong></h5>
            <ul>
                ${resumeData.achievements?.map(achievement => `<li>${achievement}</li>`).join('') || ' '}
            </ul>
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Certificates</strong></h5>
            ${resumeData.certificates?.map(certificate => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong><a href="${certificate.link}" target="_blank">${certificate.name}</a></strong></p>
                    </div>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="resume-section d-flex flex-column justify-content-start">
        <div class="d-flex flex-row justify-content-start" style="height: 50px; margin-bottom: -30px;">
            <p style="padding-right: 5px; font-size: 14px;"><strong>Soft skills</strong></p>
            <p>${resumeData.softskills?.join(', ') || ''}</p>
        </div>
        <div class="d-flex flex-row justify-content-start" style="height: 50px; margin-bottom: -30px;">
            <p style="padding-right: 5px; font-size: 14px;"><strong>Technical Skills</strong></p>
            <p>${resumeData.technicalskills?.join(', ') || ''}</p>
        </div>
    </div>
</div>
        `,
    template3: (resumeData) => `
            <div class="resume-container" style="font-family: Arial, sans-serif;">
    <div class="resume-header text-center">
        <h1>${resumeData.fullname}</h1>
        <p style="margin-top: -10px;">
            <strong>Email:</strong> <a href="mailto:${resumeData.email}" target="_blank">${resumeData.email}</a> 
            <strong>Mobile:</strong> ${resumeData.phone_number}
        </p>
        <p style="margin-top: -15px;">
            <strong>LinkedIn:</strong> <a href="${resumeData.linkedin_link}" target="_blank">${resumeData.linkedin_link}</a>
        </p>
    </div>

    <div class="resume-section">
        <h5 style="margin-top: -6px;"><strong>Summary</strong></h5>
        <p>
            Dedicated ${resumeData.job_role} seeking a challenging position in a reputed organization where I can learn new skills, 
            expand my knowledge, and leverage my learnings to get an opportunity where I can make the best of my potential 
            and contribute to both my and the organization's growth.
        </p>
    </div>

    <div class="resume-section">
        <h5><strong>Education</strong></h5>
        <div class="education-container">
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.college_name}</p>
                    <p>${resumeData.college_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.college_degree} (${resumeData.college_course})</p>
                    <p>${resumeData.college_marks} CGPA/Marks</p>
                </div>
            </div>
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.intermediate_name}</p>
                    <p>${resumeData.intermediate_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.intermediate_degree} (${resumeData.intermediate_course})</p>
                    <p>${resumeData.intermediate_marks}</p>
                </div>
            </div>
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.school_name}</p>
                    <p>${resumeData.school_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.school_degree}</p>
                    <p>${resumeData.school_marks} CGPA/Marks</p>
                </div>
            </div>
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5><strong>Experience</strong></h5>
            ${resumeData.experiences?.map(experience => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong>${experience.title}</strong></p>
                        <p><strong>${experience.startDate} - ${experience.endDate}</strong></p>
                    </div>
                    <p>In this my role is ${experience.jobRole}, ${experience.description}</p>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Projects</strong></h5>
            ${resumeData.projects?.map(project => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong>${project.name}</strong> 
                            <a href="${project.link}" target="_blank">(${project.link})</a>
                        </p>
                    </div>
                    <p>${project.description}</p>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Achievements</strong></h5>
            <ul>
                ${resumeData.achievements?.map(achievement => `<li>${achievement}</li>`).join('') || ' '}
            </ul>
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Certificates</strong></h5>
            ${resumeData.certificates?.map(certificate => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong><a href="${certificate.link}" target="_blank">${certificate.name}</a></strong></p>
                    </div>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="resume-section d-flex flex-column justify-content-start">
        <div class="d-flex flex-row justify-content-start" style="height: 50px; margin-bottom: -30px;">
            <p style="padding-right: 5px; font-size: 14px;"><strong>Soft skills</strong></p>
            <p>${resumeData.softskills?.join(', ') || ''}</p>
        </div>
        <div class="d-flex flex-row justify-content-start" style="height: 50px; margin-bottom: -30px;">
            <p style="padding-right: 5px; font-size: 14px;"><strong>Technical Skills</strong></p>
            <p>${resumeData.technicalskills?.join(', ') || ''}</p>
        </div>
    </div>
</div>
        `,
    template4: (resumeData) => `
        <div class="resume-container" style="font-family: Arial, sans-serif;">
    <div class="resume-header text-center">
        <h1>${resumeData.fullname}</h1>
        <p style="margin-top: -10px;">
            <strong>Email:</strong> <a href="mailto:${resumeData.email}" target="_blank">${resumeData.email}</a> 
            <strong>Mobile:</strong> ${resumeData.phone_number}
        </p>
        <p style="margin-top: -15px;">
            <strong>LinkedIn:</strong> <a href="${resumeData.linkedin_link}" target="_blank">${resumeData.linkedin_link}</a>
        </p>
    </div>

    <div class="resume-section">
        <h5 style="margin-top: -6px;"><strong>Summary</strong></h5>
        <p>
            Dedicated ${resumeData.job_role} seeking a challenging position in a reputed organization where I can learn new skills, 
            expand my knowledge, and leverage my learnings to get an opportunity where I can make the best of my potential 
            and contribute to both my and the organization's growth.
        </p>
    </div>

    <div class="resume-section">
        <h5><strong>Education</strong></h5>
        <div class="education-container">
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.college_name}</p>
                    <p>${resumeData.college_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.college_degree} (${resumeData.college_course})</p>
                    <p>${resumeData.college_marks} CGPA/Marks</p>
                </div>
            </div>
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.intermediate_name}</p>
                    <p>${resumeData.intermediate_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.intermediate_degree} (${resumeData.intermediate_course})</p>
                    <p>${resumeData.intermediate_marks}</p>
                </div>
            </div>
            <div class="education-detail-container">
                <div class="education-detail top-container">
                    <p>${resumeData.school_name}</p>
                    <p>${resumeData.school_year}</p>
                </div>
                <div class="education-detail">
                    <p>${resumeData.school_degree}</p>
                    <p>${resumeData.school_marks} CGPA/Marks</p>
                </div>
            </div>
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5><strong>Experience</strong></h5>
            ${resumeData.experiences?.map(experience => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong>${experience.title}</strong></p>
                        <p><strong>${experience.startDate} - ${experience.endDate}</strong></p>
                    </div>
                    <p>In this my role is ${experience.jobRole}, ${experience.description}</p>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Projects</strong></h5>
            ${resumeData.projects?.map(project => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong>${project.name}</strong> 
                            <a href="${project.link}" target="_blank">(${project.link})</a>
                        </p>
                    </div>
                    <p>${project.description}</p>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Achievements</strong></h5>
            <ul>
                ${resumeData.achievements?.map(achievement => `<li>${achievement}</li>`).join('') || ' '}
            </ul>
        </div>
    </div>

    <div class="d-flex flex-row justify-content-start">
        <div class="resume-section">
            <h5 class="spl-head"><strong>Certificates</strong></h5>
            ${resumeData.certificates?.map(certificate => `
                <div class="resume-section-bigdata">
                    <div class="resume-section-bigdata-title-card">
                        <p><strong><a href="${certificate.link}" target="_blank">${certificate.name}</a></strong></p>
                    </div>
                </div>
            `).join('') || ' '}
        </div>
    </div>

    <div class="resume-section d-flex flex-column justify-content-start">
        <div class="d-flex flex-row justify-content-start" style="height: 50px; margin-bottom: -30px;">
            <p style="padding-right: 5px; font-size: 14px;"><strong>Soft skills</strong></p>
            <p>${resumeData.softskills?.join(', ') || ''}</p>
        </div>
        <div class="d-flex flex-row justify-content-start" style="height: 50px; margin-bottom: -30px;">
            <p style="padding-right: 5px; font-size: 14px;"><strong>Technical Skills</strong></p>
            <p>${resumeData.technicalskills?.join(', ') || ''}</p>
        </div>
    </div>
</div>
        `,
};

document.getElementById("chooseTemplatesBtn").addEventListener("click", fetchResumeData);

async function fetchResumeData() {
    const spinner = document.getElementById("spinner");
    spinner.style.display = "block";

    try {
        try {
            const response = await fetch('/resumetemplates');
            if (!response.ok) {
                throw new Error("Failed to fetch resume templates.");
            }
            const data = await response.json();
            const resumeData = data;

            if (resumeData) {
                const resumetemplate1 = templates.template1(resumeData);
                const resumetemplate2 = templates.template2(resumeData);
                const resumetemplate3 = templates.template3(resumeData);
                const resumetemplate4 = templates.template4(resumeData);

                document.getElementById('resume-1').innerHTML = resumetemplate1;
                document.getElementById('resume-2').innerHTML = resumetemplate2;
                document.getElementById('resume-3').innerHTML = resumetemplate3;
                document.getElementById('resume-4').innerHTML = resumetemplate4;
            }
        } catch (error) {
            alert("No data found!");
        }
    } finally {
        spinner.style.display = "none";
    }
}


let currentResumeIndex = 0;
const resumes = document.querySelectorAll(".resume-template");

function showResume(index) {
    resumes.forEach((resume, i) => {
        resume.style.display = i === index ? "block" : "none";
    });
}

function showPreviousResume() {
    currentResumeIndex = (currentResumeIndex - 1 + resumes.length) % resumes.length;
    showResume(currentResumeIndex);
}

function showNextResume() {
    currentResumeIndex = (currentResumeIndex + 1) % resumes.length;
    showResume(currentResumeIndex);
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("detailsFrom");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const data = {
            fullname: document.getElementById('fullname').value,
            phone_number: document.getElementById('phonenumber').value,
            job_role: document.getElementById('jobrole').value,
            email: document.getElementById('email').value,

            school_name: document.getElementById('schoolname').value,
            school_marks: document.getElementById('schoolMarks').value,
            school_year: parseInt(document.getElementById('schoolYear').value),
            school_degree: document.getElementById('schoolDegree').value,

            intermediate_name: document.getElementById('intermediateName').value,
            intermediate_degree: document.getElementById('interDegree').value,
            intermediate_course: document.getElementById('interCourse').value,
            intermediate_marks: document.getElementById('interMarks').value,
            intermediate_year: parseInt(document.getElementById('interYear').value),

            college_name: document.getElementById('collegeName').value,
            college_degree: document.getElementById('collegeDegree').value,
            college_course: document.getElementById('collegeCourse').value,
            college_marks: document.getElementById('collegeMarks').value,
            college_year: parseInt(document.getElementById('collegeYear').value),
            linkedin_Link: document.getElementById('linkedinLink').value,

            softSkills: getCheckedValues("soft-checkbox-list"),
            technicalSkills: getCheckedValues("technical-checkbox-list"),
            achievements: collectAchievements(),
            certificates: collectCertificates(),
            experiences: collectExperiences(),
            projects: collectProjects()
        };

        const messageBox = document.getElementById("formModal");
        messageBox.style.display = "block";

        document.getElementById("form-spinner").style.display = "block";

        try {
            const response = await fetch("/resumedata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Hide spinner
                document.getElementById("form-spinner").style.display = "none";
                document.getElementById("formMessageContent").style.display = "block";

                // Show success message
                document.getElementById("fromMessage").textContent = result.message || "✅ Form submitted successfully!";

                // Show next button
                document.getElementById("formButton").style.display = "block";
            } else {
                alert("Error: " + (result.message || "Unknown error occurred"));
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Something went wrong!");
        }

    });

    function getCheckedValues(containerId) {
        return Array.from(document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`))
            .map(input => input.value);
    }

    function collectAchievements() {
        const entries = document.querySelectorAll('#achievementsContainer .achievement-entry input');
        const achievements = [];

        entries.forEach(entry => {
            const value = entry.value.trim();
            if (value) achievements.push(value);
        });

        return achievements;
    }

    function collectCertificates() {
        const entries = document.querySelectorAll('#certificatesContainer .certificate-entry');
        const certificates = [];

        entries.forEach(entry => {
            const name = entry.querySelector('input[name*="[name]"]').value;
            const link = entry.querySelector('input[name*="[link]"]').value;

            if (name.trim() && link.trim()) {
                certificates.push({ name, link });
            }
        });

        return certificates;
    }

    function collectExperiences() {
        const entries = document.querySelectorAll('.experincesContainer .experience-entry');
        const experiences = [];

        entries.forEach(entry => {
            const title = entry.querySelector('input[name*="[title]"]').value;
            const company = entry.querySelector('input[name*="[company]"]').value;
            const jobRole = entry.querySelector('input[name*="[jobRole]"]').value;
            const startDate = entry.querySelector('input[name*="[startDate]"]').value;
            const endDate = entry.querySelector('input[name*="[endDate]"]').value;
            const description = entry.querySelector('textarea[name*="[description]"]').value;

            if (title && company && jobRole && startDate && endDate && description) {
                experiences.push({ title, company, jobRole, startDate, endDate, description });
            }
        });

        return experiences;
    }

    function collectProjects() {
        const entries = document.querySelectorAll('#projectsContainer .project-entry');
        const projects = [];

        entries.forEach(entry => {
            const name = entry.querySelector('input[name*="[name]"]').value;
            const link = entry.querySelector('input[name*="[link]"]').value;
            const description = entry.querySelector('textarea[name*="[description]"]').value;

            if (name.trim() && link.trim() && description.trim()) {
                projects.push({ name, link, description });
            }
        });

        return projects;
    }
});

function openFilenameModal() {
    document.getElementById('filenameInput').value = '';
    document.getElementById("myModalFilename").style.display = "flex"; // <- use "flex" here
}

function updateModal(){
    document.getElementById("myModalUserdetails").style.display = "flex";
}

const myModalCloseBtn = document.getElementById("myModalFilenameClose");
myModalCloseBtn.addEventListener("click", function () {
    document.getElementById("myModalFilename").style.display = "none";
});


document.getElementById("myModalUserdetailsClose").addEventListener("click", function () {
    document.getElementById("myModalUserdetails").style.display = "none";
});


function downloadResumePDF() {
    const userInput = document.getElementById('filenameInput').value.trim();

    if (!userInput) {
        alert("Please enter a filename.");
        return;
    }

    const visibleResume = document.querySelector('.resume-template[style*="display: block"]');
    if (!visibleResume) {
        alert("No visible resume to download.");
        return;
    }

    const element = document.createElement('div');
    element.innerHTML = visibleResume.innerHTML;

    const opt = {
        margin: 0,
        filename: userInput + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Hide modal before download
    document.getElementById("myModalFilename").style.display = "none";

    html2pdf().set(opt).from(element).save();
}


document.getElementById("updateDetailsForm").addEventListener("submit", async function(event) {
  event.preventDefault(); 
  const formData = new FormData(this);
  const data = Object.fromEntries(formData.entries());
  try {
    const response = await fetch("/updateDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("myModalUserdetails").style.display="none"; // Or use Bootstrap JS: bootstrap.Modal.getInstance(modal).hide();

      // ✅ Refresh user details
      fetch("/userdetails")
        .then(res => res.json())
        .then(data => {
          const user = data.user;
          document.getElementById("username").innerHTML = user.username;
          document.getElementById("userName").innerHTML = user.username;
          document.getElementById("firstName").innerHTML = user.firstname;
          document.getElementById("secondName").innerHTML = user.secondname;
        });

    } else {
      alert("Error: " + result.error);
    }

  } catch (err) {
    console.error("Error updating details:", err);
    alert("Something went wrong.");
  }
});

