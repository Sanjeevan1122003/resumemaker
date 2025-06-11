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


document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const firstname = document.getElementById("firstName").value;
    const secondname = document.getElementById("secondname").value;
    const username = document.getElementById("username").value;
    const gender = document.querySelector("input[name='gender']:checked")?.value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const modal = document.getElementById("signupModal");
    const spinner = document.getElementById("signupSpinner");
    const modalMessage = document.getElementById("signupModalMessage");

    // Show modal + spinner, clear message
    modal.style.display = "block";
    spinner.style.display = "block";
    modalMessage.textContent = "";

    try {
        const response = await fetch("/usersignup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ firstname, secondname, username, gender, email, password }),
        });

        const data = await response.json();

        spinner.style.display = "none";
        showSignupModal(response.ok ? "success" : "error", response.ok ? data.message : data.error);

        if (response.ok) {
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 2000);
        }
    } catch (error) {
        spinner.style.display = "none";
        showSignupModal("error", "Something went wrong. Try again.");
    }
});

function showSignupModal(type, message) {
    const modalMessage = document.getElementById("signupModalMessage");
    const loginRedirectBtn = document.getElementById("loginBtn");

    if (message === "User already exists. Please log in. 😊") {
        modalMessage.textContent = message;
        document.getElementById("signupModal").style.display = "block";
        loginRedirectBtn.style.display = "block";
    } else {
        modalMessage.textContent = message;
        loginRedirectBtn.style.display = "none";

        setTimeout(() => {
            document.getElementById("signupModal").style.display = "none";
        }, 3500);
    }
}

// Close button
document.getElementById("closeSignupModal").onclick = function () {
    document.getElementById("signupModal").style.display = "none";
};
