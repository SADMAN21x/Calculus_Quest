pages.common.profile = function (u) {
 return '<h2>Profile</h2><div class="card"><span class="avatar">' + (u.pic ? '<img src="' + u.pic + '" alt="">' : escapeHtml(u.name[0])) + '</span><input type="file" accept="image/*" onchange="setPicture(this)"><form id="profileForm" novalidate>' + field("profName", "Full name", "text", u.name) + field("profEmail", "Email", "text", u.email) + '<button type="submit">Save changes</button></form></div>' +
 '<div class="card"><h3>Change password</h3><form id="passwordForm" novalidate>' + field("oldPass", "Current password", "password") + field("newPassword", "New password", "password") + field("confirmPassword", "Confirm new password", "password") + '<button type="submit">Update password</button></form></div>' +
 '<div class="card"><h3>Delete account</h3><button class="danger" onclick="removeAccount()">Delete my account</button></div>';
};

handlers.profileForm = function () {
 let u = currentUser();
 let valid = true;
 valid = checkName("profName") && valid;
 let emailOk = checkEmail("profEmail");
 valid = emailOk && valid;
 let email = getInput("profEmail").value.trim().toLowerCase();
 if (emailOk && db.users.some(function (x) {
 return x.email === email && x.id !== u.id;
 })) {
 showError(getInput("profEmail"), "profEmailError", "This email is already used.");
 valid = false;
 }
 if (valid) {
 u.name = getInput("profName").value.trim();
 u.email = email;
 addLog("Updated profile");
 render();
 }
};

handlers.passwordForm = function () {
 let u = currentUser();
 let valid = true;
 let old = getInput("oldPass");
 if (old.value !== u.pass) {
 showError(old, "oldPassError", "Current password is wrong.");
 valid = false;
 } else {
 showSuccess(old);
 }
 valid = checkPassword("newPassword") && valid;
 valid = checkConfirm("confirmPassword", "newPassword") && valid;
 if (valid) {
 u.pass = getInput("newPassword").value;
 addLog("Changed password");
 render();
 alert("Password updated.");
 }
};

function setPicture(input) {
 let file = input.files[0];
 if (!file) {
 return;
 }
 if (file.size > 150000) {
 alert("Choose an image under 150 KB.");
 return;
 }
 let reader = new FileReader();
 reader.onload = function () {
 currentUser().pic = reader.result;
 saveData();
 render();
 };
 reader.readAsDataURL(file);
}

function removeAccount() {
 if (!confirm("Delete your account permanently?")) {
 return;
 }
 let id = db.session;
 addLog("Deleted own account");
 db.users = db.users.filter(function (u) {
 return u.id !== id;
 });
 db.session = null;
 saveData();
 render();
}
