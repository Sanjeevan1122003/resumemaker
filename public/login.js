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


document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const modal = document.getElementById("loginModal");
    const spinner = document.getElementById("spinner");
    const modalMessage = document.getElementById("modalMessage");

    // Show modal + spinner, clear message
    modal.style.display = "block";
    spinner.style.display = "block";
    modalMessage.textContent = "";

    try {
        const response = await fetch("/userlogin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // Hide spinner and show message
        spinner.style.display = "none";
        showModal(response.ok ? "success" : "error", response.ok ? data.message : data.error);

        if (response.ok) {
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 2000);
        }
    } catch (error) {
        spinner.style.display = "none";
        showModal("error", "Something went wrong. Try again.");
    }
});

function showModal(type, message) {
    const modalMessage = document.getElementById("modalMessage");
    const modalButton = document.getElementById("signUpbutton");


    if (message === "No data found. You seem to be a new user, please sign up. 👍") {
        modalMessage.textContent = `${message}`;
        document.getElementById("loginModal").style.display = "block";
        modalButton.style.display = "block";
    }
    else {
        modalMessage.textContent = message;

        setTimeout(() => {
            document.getElementById("loginModal").style.display = "none";
        }, 3500);
    }
}

// Close button
document.getElementById("closeModal").onclick = function () {
    document.getElementById("loginModal").style.display = "none";
};




