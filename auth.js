function showError(input, errorId, message) {
 input.classList.add("errorBorder");
 input.classList.remove("successBorder");
 document.getElementById(errorId).innerHTML = message;
}

function showSuccess(input) {
 input.classList.remove("errorBorder");
 input.classList.add("successBorder");
}

function clearErrors() {
 let errors = document.querySelectorAll(".error");
 errors.forEach(function (item) {
 item.innerHTML = "";
 });
 let fields = document.querySelectorAll("input, select, textarea");
 fields.forEach(function (field) {
 field.classList.remove("errorBorder");
 field.classList.remove("successBorder");
 });
}

function checkName(id) {
 let input = getInput(id);
 let value = input.value.trim();
 if (value === "") {
 showError(input, id + "Error", "Name is required.");
 return false;
 } else if (!/^[A-Za-z ]+$/.test(value)) {
 showError(input, id + "Error", "Only letters and spaces are allowed.");
 return false;
 } else if (value.length < 3) {
 showError(input, id + "Error", "Name must be at least 3 characters.");
 return false;
 }
 showSuccess(input);
 return true;
}

function checkEmail(id) {
 let input = getInput(id);
 let value = input.value.trim();
 if (value === "") {
 showError(input, id + "Error", "Email is required.");
 return false;
 } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
 showError(input, id + "Error", "Invalid email address.");
 return false;
 }
 showSuccess(input);
 return true;
}

function checkPassword(id) {
 let input = getInput(id);
 let value = input.value;
 if (value === "") {
 showError(input, id + "Error", "Password is required.");
 return false;
 } else if (value.length < 8) {
 showError(input, id + "Error", "Password must be at least 8 characters.");
 return false;
 } else if (!/[A-Z]/.test(value)) {
 showError(input, id + "Error", "Add at least one uppercase letter.");
 return false;
 } else if (!/[a-z]/.test(value)) {
 showError(input, id + "Error", "Add at least one lowercase letter.");
 return false;
 } else if (!/[0-9]/.test(value)) {
 showError(input, id + "Error", "Add at least one digit.");
 return false;
 }
 showSuccess(input);
 return true;
}

function checkConfirm(id, passwordId) {
 let input = getInput(id);
 if (input.value === "") {
 showError(input, id + "Error", "Please confirm your password.");
 return false;
 } else if (input.value !== getInput(passwordId).value) {
 showError(input, id + "Error", "Passwords do not match.");
 return false;
 }
 showSuccess(input);
 return true;
}

function checkSelect(id, message) {
 let input = getInput(id);
 if (input.value === "") {
 showError(input, id + "Error", message);
 return false;
 }
 showSuccess(input);
 return true;
}

function checkText(id, label, min, max) {
 let input = getInput(id);
 let length = input.value.trim().length;
 if (length === 0) {
 showError(input, id + "Error", label + " is required.");
 return false;
 } else if (length < min) {
 showError(input, id + "Error", label + " must be at least " + min + " characters.");
 return false;
 } else if (length > max) {
 showError(input, id + "Error", label + " must be at most " + max + " characters.");
 return false;
 }
 showSuccess(input);
 return true;
}

function showAuth(id) {
 ["loginForm", "registerForm", "forgotForm", "resetForm"].forEach(function (f) {
 getInput(f).classList.add("hidden");
 });
 getInput(id).classList.remove("hidden");
 clearErrors();
}

handlers.loginForm = function () {
 let email = getInput("loginEmail");
 let password = getInput("loginPassword");
 let valid = true;
 valid = checkEmail("loginEmail") && valid;
 if (password.value === "") {
 showError(password, "loginPasswordError", "Password is required.");
 valid = false;
 } else {
 showSuccess(password);
 }
 if (!valid) {
 return;
 }
 let user = db.users.find(function (u) {
 return u.email === email.value.trim().toLowerCase() && u.pass === password.value;
 });
 if (!user) {
 showError(password, "loginPasswordError", "Wrong email or password.");
 return;
 }
 db.session = user.id;
 addLog("Logged in");
 currentPage = "dashboard";
 getInput("loginForm").reset();
 clearErrors();
 render();
};

handlers.registerForm = function () {
 let valid = true;
 valid = checkName("regName") && valid;
 let emailOk = checkEmail("regEmail");
 valid = emailOk && valid;
 if (emailOk && db.users.some(function (u) {
 return u.email === getInput("regEmail").value.trim().toLowerCase();
 })) {
 showError(getInput("regEmail"), "regEmailError", "This email is already registered.");
 valid = false;
 }
 valid = checkSelect("regRole", "Please select a role.") && valid;
 valid = checkPassword("regPassword") && valid;
 valid = checkConfirm("regConfirm", "regPassword") && valid;
 if (valid) {
 db.users.push({ id: db.uid++, name: getInput("regName").value.trim(), email: getInput("regEmail").value.trim().toLowerCase(), pass: getInput("regPassword").value, role: getInput("regRole").value, xp: 0, streak: 0, last: "", done: {}, pic: "" });
 saveData();
 getInput("registerForm").reset();
 clearErrors();
 showAuth("loginForm");
 alert("Account created. Please log in.");
 }
};

handlers.forgotForm = function () {
 if (!checkEmail("forgotEmail")) {
 return;
 }
 let email = getInput("forgotEmail").value.trim().toLowerCase();
 let found = db.users.some(function (u) {
 return u.email === email;
 });
 if (!found) {
 showError(getInput("forgotEmail"), "forgotEmailError", "No account with this email.");
 return;
 }
 resetEmail = email;
 getInput("forgotForm").reset();
 showAuth("resetForm");
};

handlers.resetForm = function () {
 let valid = true;
 valid = checkPassword("resetPassword") && valid;
 valid = checkConfirm("resetConfirm", "resetPassword") && valid;
 if (valid) {
 db.users.find(function (u) {
 return u.email === resetEmail;
 }).pass = getInput("resetPassword").value;
 saveData();
 getInput("resetForm").reset();
 showAuth("loginForm");
 alert("Password updated. Please log in.");
 }
};

function logout() {
 addLog("Logged out");
 db.session = null;
 saveData();
 render();
}
