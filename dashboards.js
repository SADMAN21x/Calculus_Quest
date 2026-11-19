pages.student.dashboard = function (u) {
 let done = doneCount(u);
 let total = totalLevels();
 let percent = total ? Math.round(done / total * 100) : 0;
 let next = "";
 db.courses.forEach(function (c) {
 if (!c.pub || next !== "") {
 return;
 }
 c.levels.forEach(function (L, i) {
 if (next === "" && !u.done[c.id + "-" + i] && unlocked(u, c, i)) {
 next = '<div class="level"><span>' + escapeHtml(c.title) + " - " + escapeHtml(L.name) + '</span><button onclick="startLevel(' + c.id + "," + i + ')">Continue</button></div>';
 }
 });
 });
 return banner("Welcome back, " + escapeHtml(u.name) + "!", "Continue your learning journey.") +
 '<div class="grid">' + statCard("Level", levelOf(u)) + statCard("XP", u.xp) + statCard("Completed", done + " / " + total) + statCard("Streak", u.streak + " days") + "</div>" +
 '<div class="card"><h3>Continue learning</h3>' + (next || "<p>All levels complete. Great work!</p>") + "</div>" +
 '<div class="card"><h3>Your progress: ' + percent + '%</h3><div class="bar"><i style="width:' + percent + '%"></i></div><p>' + (u.last === dayString(0) ? "Daily target met today." : "Daily target: finish one level today.") + "</p></div>";
};

pages.teacher.dashboard = function (u) {
 let students = db.users.filter(function (x) {
 return x.role === "student";
 });
 let pending = db.tasks.filter(function (t) {
 return t.to === u.id && !t.done;
 }).length;
 let sum = 0;
 students.forEach(function (s) {
 sum += doneCount(s);
 });
 let average = students.length && totalLevels() ? Math.round(sum / students.length / totalLevels() * 100) : 0;
 return banner("Welcome, " + escapeHtml(u.name) + "!", "Manage your courses and track student progress.") + '<div class="grid">' + statCard("Students", students.length) + statCard("Courses", db.courses.length) + statCard("Pending tasks", pending) + statCard("Avg. progress", average + "%") + "</div>";
};

pages.admin.dashboard = function () {
 let count = function (role) {
 return db.users.filter(function (u) {
 return u.role === role;
 }).length;
 };
 return banner("Welcome, Admin!", "Oversee the entire system.") + '<div class="grid">' + statCard("Total users", db.users.length) + statCard("Students", count("student")) + statCard("Teachers", count("teacher")) + statCard("Complaint officers", count("officer")) + "</div><h3>Recent activity</h3>" + logTable(db.logs.slice(0, 6));
};

pages.officer.dashboard = function (u) {
 let count = function (status) {
 return db.complaints.filter(function (c) {
 return c.status === status;
 }).length;
 };
 return banner("Welcome, " + escapeHtml(u.name) + "!", "Monitor reports, review content and handle student complaints.") + '<div class="grid">' + statCard("Total complaints", db.complaints.length) + statCard("Pending", count("Pending")) + statCard("In progress", count("In Progress")) + statCard("Resolved", count("Resolved")) + "</div>";
};
