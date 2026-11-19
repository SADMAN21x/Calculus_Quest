pages.admin.users = function () {
 let rows = "";
 db.users.forEach(function (u) {
 let roles = "";
 ["student", "teacher", "officer", "admin"].forEach(function (r) {
 roles += "<option" + (r === u.role ? " selected" : "") + ">" + r + "</option>";
 });
 rows += "<tr><td>" + escapeHtml(u.name) + "</td><td>" + escapeHtml(u.email) + '</td><td><select onchange="setRole(' + u.id + ', this.value)">' + roles + "</select></td><td>" + (u.id === db.session ? "" : '<button class="danger" onclick="removeUser(' + u.id + ')">Delete</button>') + "</td></tr>";
 });
 return '<h2>Users</h2><div class="card"><form id="userForm" novalidate>' + field("newName", "Full name", "text") + field("newEmail", "Email", "text") +
 selectField("newRole", "Role", [["student", "Student"], ["teacher", "Teacher"], ["officer", "Complaint Officer"], ["admin", "Admin"]]) + field("newPass", "Password", "password") + '<button type="submit">Add user</button></form></div>' +
 "<table><tr><th>Name</th><th>Email</th><th>Role</th><th></th></tr>" + rows + "</table>";
};

handlers.userForm = function () {
 let valid = true;
 valid = checkName("newName") && valid;
 let emailOk = checkEmail("newEmail");
 valid = emailOk && valid;
 if (emailOk && db.users.some(function (u) {
 return u.email === getInput("newEmail").value.trim().toLowerCase();
 })) {
 showError(getInput("newEmail"), "newEmailError", "This email is already registered.");
 valid = false;
 }
 valid = checkSelect("newRole", "Please select a role.") && valid;
 valid = checkPassword("newPass") && valid;
 if (valid) {
 db.users.push({ id: db.uid++, name: getInput("newName").value.trim(), email: getInput("newEmail").value.trim().toLowerCase(), pass: getInput("newPass").value, role: getInput("newRole").value, xp: 0, streak: 0, last: "", done: {}, pic: "" });
 addLog("Added a user");
 render();
 }
};

function setRole(id, role) {
 db.users.find(function (u) {
 return u.id === id;
 }).role = role;
 addLog("Changed a user role to " + role);
}

function removeUser(id) {
 if (confirm("Delete this user?")) {
 db.users = db.users.filter(function (u) {
 return u.id !== id;
 });
 addLog("Deleted a user");
 render();
 }
}

pages.admin.content = function () {
 let rows = "";
 db.courses.forEach(function (c) {
 rows += "<tr><td>" + escapeHtml(c.title) + "</td><td>" + c.levels.length + "</td><td>" + (c.pub ? "Published" : "Draft") + '</td><td><button class="light" onclick="renameCourse(' + c.id + ')">Edit</button> <button class="danger" onclick="removeCourse(' + c.id + ')">Delete</button></td></tr>';
 });
 return "<h2>System data</h2><table><tr><th>Course</th><th>Levels</th><th>Status</th><th></th></tr>" + rows + "</table>";
};

pages.admin.tasks = function () {
 let teachers = db.users.filter(function (u) {
 return u.role === "teacher";
 }).map(function (t) {
 return [t.id, t.name];
 });
 return '<h2>Assign daily task</h2><div class="card"><form id="assignForm" novalidate>' + selectField("assignTeacher", "Teacher", teachers) + field("assignText", "Task", "text") + '<button type="submit">Assign task</button></form></div>' + taskTable(db.tasks, false);
};

handlers.assignForm = function () {
 let valid = true;
 valid = checkSelect("assignTeacher", "Please select a teacher.") && valid;
 valid = checkText("assignText", "Task", 5, 100) && valid;
 if (valid) {
 let to = Number(getInput("assignTeacher").value);
 db.tasks.unshift({ id: Date.now(), to: to, text: getInput("assignText").value.trim(), date: dayString(0), done: false });
 addLog("Assigned a task to " + userName(to));
 render();
 }
};

pages.admin.logs = function () {
 return "<h2>System logs</h2><p>Monitor teachers, complaint officers and all users.</p>" + logTable(db.logs);
};
