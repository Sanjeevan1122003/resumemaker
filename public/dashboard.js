async function fetchUserData() {
            try {
                const response = await fetch("/userdata");
                const user = await response.json();

                if (response.ok) {
                    document.getElementById("username1").innerText = user.username;
                    document.getElementById("username2").innerText = user.username;
                    document.getElementById("useremail").innerText = user.eamil;
                    document.getElementById("userfirstname").innerText = user.firstname;
                    document.getElementById("usersecondname").innerText = user.secondname;
                } else {
                    document.getElementById("userData").innerHTML = `<p>Error: ${user.error}</p>`;
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                document.getElementById("userData").innerHTML = "<p>Error loading data.</p>";
            }
        }

        fetchUserData();

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

        function display(sectionId) {
            const sections = ['sectionDashboard', 'sectionLoader', 'sectionGenerateResume'];

            sections.forEach(section => {
                const element = document.getElementById(section);
                element.style.display = 'none';

                if (section === 'sectionLoader') {
                    const blinkElement = document.getElementById('blink');
                    let dots = 0;

                    setInterval(() => {
                        dots = (dots + 1) % 4;
                        blinkElement.textContent = '.'.repeat(dots);
                    }, 500);


                    let num = 1;

                    function loadAndTick() {
                        setTimeout(() => {
                            document.getElementById("load" + num).style.display = "block";
                            setTimeout(() => {
                                document.getElementById("tick" + num).classList.add("checked");
                                num++;
                                setTimeout(loadAndTick, 1000);
                            }, 2000);
                        }, 1000);
                        if (num > 4) {
                            document.getElementById("getStartedBtn").style.display = "block";
                        }
                    }

                    loadAndTick();
                }
            });

            const selectedSection = document.getElementById(sectionId);
            selectedSection.style.display = 'block';
        }
