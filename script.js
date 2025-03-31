window.onload = function () {
    setTimeout(() => {
        document.getElementById("intro").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    }, 3000);
};

// Login System
function checkLogin() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "1234") {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("error-msg").style.display = "block";
    }
}

// Logout
function logout() {
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}

// Protect Dashboard
if (window.location.pathname.includes("dashboard.html")) {
    if (!localStorage.getItem("loggedIn")) {
        window.location.href = "login.html";
    }
}

// To-Do List
function addTask() {
    let task = document.getElementById("todo-input").value;
    if (task.trim() !== "") {
        let list = document.getElementById("todo-list");
        let li = document.createElement("li");
        li.textContent = task;
        list.appendChild(li);
        document.getElementById("todo-input").value = "";
    }
}

// File Upload Storage
document.getElementById("file-upload")?.addEventListener("change", function () {
    document.getElementById("uploaded-file").innerText = "Uploaded: " + this.files[0].name;
});

document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordBtn = document.getElementById("forgot-password");
    const otpModal = document.getElementById("otp-modal");
    const verifyOtpBtn = document.getElementById("verify-otp");

    if (forgotPasswordBtn) {
        // Forgot Password Click Event
        forgotPasswordBtn.addEventListener("click", function () {
            fetch("http://localhost:5000/send-otp", { method: "POST" })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("✅ OTP Sent! Check your email.");
                        otpModal.style.display = "block"; // Show OTP input modal
                    } else {
                        alert("❌ Failed to send OTP. Try again.");
                    }
                })
                .catch(error => {
                    console.error("Error sending OTP:", error);
                    alert("❌ Server error! Make sure backend is running.");
                });
        });
    } else {
        console.error("❌ Forgot Password button not found!");
    }

    // Verify OTP
    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener("click", function () {
            let otpInput = document.getElementById("otp-input").value;
            fetch("http://localhost:5000/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp: otpInput }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    otpModal.style.display = "none";
                    document.getElementById("reset-password-container").style.display = "block";
                }
            })
            .catch(error => {
                console.error("Invalid OTP:", error);
                alert("❌ Invalid OTP! Try again.");
            });
        });
    }

    // Handle Password Reset
    const resetPasswordForm = document.getElementById("reset-password-form");
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let newAlphaPassword = document.getElementById("new-alpha-password").value.trim();
            let newNumericPassword = document.getElementById("new-numeric-password").value.trim();

            if (newAlphaPassword === "" || newNumericPassword === "") {
                alert("❌ Please enter both passwords!");
                return;
            }

            fetch("http://localhost:5000/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newAlphaPassword, newNumericPassword }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    window.location.href = "login.html"; // Redirect to login page after success
                }
            })
            .catch(error => {
                console.error("Error resetting password:", error);
                alert("❌ Failed to reset password. Try again!");
            });
        });
    }
});
