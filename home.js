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
}
const homeSection = document.getElementById("sectionHome");
if (homeSection) {
    const homeTttle = document.getElementById("homeTittle");
    const homeTitleText = " Welcome to Resume Maker!";

    const homeDescription = document.getElementById("homeDescription");
    const homeDescriptionText = " Craft a resume that sets you apart! Our platform empowers you to design professional, eye-catching resumes tailored to your dream career. Whether you're a seasoned professional or just starting, create a resume that highlights your skills, showcases your achievements, and opens doors to new opportunities.";

    const homeDescription2 = document.getElementById("homeDescription2");
    const homeDescriptionText2 = "Let’s build your future, one page at a time!";

    const homeButton = document.getElementById("homeButton");

    if (homeTttle && homeDescription && homeDescription2) {
        typeText(homeTttle, homeTitleText, 200, () => {
            typeText(homeDescription, homeDescriptionText, 50, () => {
                typeText(homeDescription2, homeDescriptionText2, 50, () => {
                    homeButton.style.display = "block";
                });
            });
        });
    }
}

const welcomTittleEl = document.getElementById("welcomePageTittle");
const welcomText = "Resume Maker";

const welcomePageGetstartedButton = document.getElementById("welcomePageGetstartedButton");
const welcomePageImageContainer = document.getElementById("welcomePageImageContainer");

if (welcomTittleEl && welcomePageGetstartedButton && welcomePageImageContainer) {
    typeText(welcomTittleEl, welcomText, 300, () => {
        welcomePageGetstartedButton.style.display = "inline-block";
        const welcomePageImage = document.createElement("img");
        welcomePageImage.id = "welcomePageImage";
        welcomePageImage.setAttribute(
            "src",
            "https://github.com/Sanjeevan1122003/resumemaker/blob/main/public/Resume-maker-logo.jpg?raw=true"
        );
        welcomePageImage.style.width = "100%";
        welcomePageImage.style.height = "200px";
        welcomePageImage.style.marginTop = "-50px";
        welcomePageImageContainer.appendChild(welcomePageImage);
    });
}