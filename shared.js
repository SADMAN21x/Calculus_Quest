let currentPage = "dashboard";

let quiz = null;

let lessonRef = null;

let practiceRun = null;

let editRef = null;

let resetEmail = "";

let handlers = {};

let pages = { student: {}, teacher: {}, admin: {}, officer: {}, common: {} };

let menus = {
 student: [["dashboard", "Dashboard"], ["learn", "Learn"], ["practice", "Practice"], ["community", "Community"], ["complaint", "Complaints"], ["results", "Results"], ["profile", "Profile"]],
 teacher: [["dashboard", "Dashboard"], ["courses", "Courses"], ["tasks", "Tasks"], ["students", "Students"], ["profile", "Profile"]],
 admin: [["dashboard", "Dashboard"], ["users", "Users"], ["content", "Content"], ["tasks", "Tasks"], ["logs", "System Logs"], ["profile", "Profile"]],
 officer: [["dashboard", "Dashboard"], ["complaints", "Complaints"], ["review", "Content Review"], ["students", "Students"], ["sms", "SMS"], ["profile", "Profile"]]
};

function dayString(back) {
 return new Date(Date.now() - back * 86400000).toISOString().slice(0, 10);
}

function escapeHtml(text) {
 return String(text).replace(/[&<>"']/g, function (c) {
 return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
 });
}

function normalize(text) {
 return text.toLowerCase().replace(/[\s*]/g, "");
}

function levelOf(u) {
 return Math.floor(u.xp / 100) + 1;
}

function totalLevels() {
 let count = 0;
 db.courses.forEach(function (c) {
 if (c.pub) {
 count += c.levels.length;
 }
 });
 return count;
}

function doneCount(u) {
 return Object.keys(u.done).length;
}

function getInput(id) {
 return document.getElementById(id);
}

function field(id, label, type, value) {
 let input = "";
 if (type === "textarea") {
 input = '<textarea id="' + id + '" rows="3"></textarea>';
 } else {
 input = '<input type="' + type + '" id="' + id + '" value="' + escapeHtml(value || "") + '">';
 }
 return '<div class="form-group"><label for="' + id + '">' + label + "</label>" + input + '<span class="error" id="' + id + 'Error"></span></div>';
}

function selectField(id, label, options) {
 let html = '<option value="">Select</option>';
 options.forEach(function (o) {
 html += '<option value="' + o[0] + '">' + escapeHtml(o[1]) + "</option>";
 });
 return '<div class="form-group"><label for="' + id + '">' + label + '</label><select id="' + id + '">' + html + '</select><span class="error" id="' + id + 'Error"></span></div>';
}

function statCard(label, value) {
 return '<div class="card"><small>' + label + "</small><b>" + value + "</b></div>";
}

function banner(title, text) {
 return '<div class="banner"><h2>' + title + "</h2>" + text + "</div>";
}

document.addEventListener("submit", function (event) {
 event.preventDefault();
 clearErrors();
 let id = event.target.id;
 let handler = handlers[id] || handlers[id.split("-")[0]];
 handler(id);
});

function go(page) {
 currentPage = page;
 quiz = null;
 editRef = null;
 render();
}

function render() {
 let u = currentUser();
 if (!u) {
 getInput("app").classList.add("hidden");
 getInput("auth").classList.remove("hidden");
 showAuth("loginForm");
 return;
 }
 getInput("auth").classList.add("hidden");
 getInput("app").classList.remove("hidden");
 let nav = "";
 menus[u.role].forEach(function (m) {
 let active = currentPage === m[0] || ((currentPage === "quiz" || currentPage === "lesson") && m[0] === "learn") || (currentPage === "practicerun" && m[0] === "practice");
 nav += '<a class="' + (active ? "active" : "") + '" onclick="go(\'' + m[0] + '\')">' + m[1] + "</a>";
 });
 getInput("nav").innerHTML = nav;
 let picture = u.pic ? '<img src="' + u.pic + '" alt="">' : escapeHtml(u.name[0]);
 getInput("topbar").innerHTML = escapeHtml(u.name) + " (" + u.role + ') <span class="avatar">' + picture + "</span>";
 let page = pages[u.role][currentPage] || pages.common[currentPage] || pages[u.role].dashboard;
 getInput("main").innerHTML = page(u);
 if (getInput("cv")) {
 drawGraph();
 }
}

function award(u, xp) {
 u.xp += xp;
 let today = dayString(0);
 if (u.last !== today) {
 u.streak = u.last === dayString(1) ? u.streak + 1 : 1;
 u.last = today;
 }
}

function postList(u, review) {
 let html = "";
 db.posts.forEach(function (p) {
 html += '<div class="card"><b>' + escapeHtml(userName(p.by)) + "</b> <small>" + p.time + "</small><p>" + escapeHtml(p.text) + '</p><div class="row"><button class="light" onclick="likePost(' + p.id + ')">Like ' + p.likes.length + "</button>";
 if (!review) {
 html += '<button class="light" onclick="commentPost(' + p.id + ')">Comment</button>';
 }
 if (review || p.by === u.id) {
 html += '<button class="danger" onclick="deletePost(' + p.id + ')">Remove</button>';
 }
 html += "</div>";
 p.comments.forEach(function (c) {
 html += '<div class="comment"><b>' + escapeHtml(userName(c.by)) + ":</b> " + escapeHtml(c.text) + "</div>";
 });
 html += "</div>";
 });
 return html || "<p>No posts yet.</p>";
}

function taskTable(list, mine) {
 let rows = "";
 list.forEach(function (t) {
 rows += "<tr><td>" + escapeHtml(t.text) + "</td><td>" + (mine ? t.date : escapeHtml(userName(t.to))) + "</td><td>" + (t.done ? "Done" : "Open") + "</td><td>" + (mine && !t.done ? '<button onclick="finishTask(' + t.id + ')">Mark complete</button>' : "") + "</td></tr>";
 });
 return "<table><tr><th>Task</th><th>" + (mine ? "Assigned" : "Teacher") + "</th><th>Status</th><th></th></tr>" + rows + "</table>";
}

function studentTable() {
 let rows = "";
 db.users.forEach(function (s) {
 if (s.role === "student") {
 rows += "<tr><td>" + escapeHtml(s.name) + "</td><td>" + escapeHtml(s.email) + "</td><td>" + levelOf(s) + "</td><td>" + s.xp + "</td><td>" + doneCount(s) + "/" + totalLevels() + "</td><td>" + s.streak + "</td></tr>";
 }
 });
 return "<table><tr><th>Student</th><th>Email</th><th>Level</th><th>XP</th><th>Levels done</th><th>Streak</th></tr>" + rows + "</table>";
}

function logTable(list) {
 let rows = "";
 list.forEach(function (x) {
 rows += "<tr><td>" + x.time + "</td><td>" + escapeHtml(x.user) + "</td><td>" + x.role + "</td><td>" + escapeHtml(x.message) + "</td></tr>";
 });
 return "<table><tr><th>Time</th><th>User</th><th>Role</th><th>Action</th></tr>" + rows + "</table>";
}
