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
const signupPosterTittleEl = document.getElementById("signupPosterTittle");
const signupPosterText = "Create your account!";

const signupPosterDescription = document.getElementById("signupPosterDescription");
const signupPosterDescriptionText =
    "Build your professional resume effortlessly and stand out from the crowd. Sign up now and take the first step toward your dream career!";

typeText(signupPosterTittleEl, signupPosterText, 150, () => {
    typeText(signupPosterDescription, signupPosterDescriptionText, 100);
});

document.getElementById("toggle-password").addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    const isPasswordHidden = passwordField.type === "password";

    // Toggle the type attribute between "password" and "text"
    passwordField.type = isPasswordHidden ? "text" : "password";

    // Change the icon class accordingly
    this.className = isPasswordHidden ? "fas fa-folder-open icon" : "fas fa-file-zipper icon";
});
