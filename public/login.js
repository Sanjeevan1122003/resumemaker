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

const loginPosterTittleEl = document.getElementById("loginPosterTittle");
const loginPosterText = "Welcome Back to Resume Maker!";

const loginPosterDescription = document.getElementById("loginPosterDescription");
const loginPosterDescriptionText =
    "We're thrilled to have you again. Log in to refine your resume and take another step toward your dream career. Let's make success happen!";


typeText(loginPosterTittleEl, loginPosterText, 150, () => {
    typeText(loginPosterDescription, loginPosterDescriptionText, 100);
});

document.getElementById("toggle-password").addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const isPasswordHidden = passwordField.type === "password";

    // Toggle the type attribute between "password" and "text"
    passwordField.type = isPasswordHidden ? "text" : "password";

    // Change the icon class accordingly
    this.className = isPasswordHidden ? "fas fa-folder-open icon" : "fas fa-file-zipper icon";
});
