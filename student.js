function unlocked(u, c, i) {
 return i === 0 || u.done[c.id + "-" + (i - 1)];
}

function startLevel(c, l) {
 if (getCourse(c).levels[l].lesson) {
 lessonRef = { c: c, l: l };
 currentPage = "lesson";
 render();
 } else {
 startQuiz(c, l);
 }
}

function startQuiz(c, l) {
 quiz = { c: c, l: l, i: 0, right: 0, shown: false, fb: "", end: null };
 currentPage = "quiz";
 render();
}

function finishLevel(u, z, L) {
 let n = L.tasks.length;
 let pass = z.right / n >= 0.6;
 let stars = z.right === n ? 3 : z.right / n >= 0.8 ? 2 : 1;
 award(u, z.right * 10);
 if (pass) {
 u.done[z.c + "-" + z.l] = { score: z.right, total: n, stars: stars };
 }
 z.end = { pass: pass, stars: stars, n: n };
 u.history = u.history || [];
 u.history.unshift({ date: dayString(0), course: getCourse(z.c).title, level: L.name, score: z.right, total: n, pass: pass, stars: stars });
 u.history = u.history.slice(0, 50);
 addLog((pass ? "Completed" : "Attempted") + " level " + L.name + " (" + z.right + "/" + n + ")");
}

handlers.quizForm = function () {
 let z = quiz;
 let L = getCourse(z.c).levels[z.l];
 let t = L.tasks[z.i];
 let u = currentUser();
 if (z.shown) {
 z.i++;
 z.shown = false;
 z.fb = "";
 if (z.i >= L.tasks.length) {
 finishLevel(u, z, L);
 }
 render();
 return;
 }
 let ans = getInput("ans");
 if (ans.value.trim() === "") {
 showError(ans, "ansError", "Type your answer first.");
 return;
 }
 let correct = t.a.map(normalize).includes(normalize(ans.value));
 if (correct) {
 z.right++;
 z.fb = "Correct! +10 XP";
 } else {
 z.fb = "Not quite. Answer: " + escapeHtml(t.a[0]);
 }
 z.shown = true;
 render();
};

let functions = {
 "x^2": [function (x) { return x * x; }, function (x) { return 2 * x; }],
 "x^3": [function (x) { return x * x * x; }, function (x) { return 3 * x * x; }],
 "sin x": [Math.sin, Math.cos],
 "e^x": [Math.exp, Math.exp],
 "0.5x^3 - 2x": [function (x) { return 0.5 * x * x * x - 2 * x; }, function (x) { return 1.5 * x * x - 2; }]
};

let derivatives = { "x^2": "2x", "x^3": "3x^2", "sin x": "cos x", "e^x": "e^x", "0.5x^3 - 2x": "1.5x^2 - 2" };

function drawGraph() {
 let c = getInput("cv");
 let g = c.getContext("2d");
 let name = getInput("fn").value;
 let f = functions[name];
 let x0 = Number(getInput("x0").value);
 let W = c.width;
 let H = c.height;
 let sx = 50;
 let sy = 32;
 let X = function (x) { return W / 2 + x * sx; };
 let Y = function (y) { return H / 2 - y * sy; };
 g.fillStyle = "#ffffff";
 g.fillRect(0, 0, W, H);
 g.lineWidth = 1;
 g.strokeStyle = "#eeeaf9";
 for (let gx = -7; gx <= 7; gx++) {
 g.beginPath();
 g.moveTo(X(gx), 0);
 g.lineTo(X(gx), H);
 g.stroke();
 }
 for (let gy = -5; gy <= 5; gy++) {
 g.beginPath();
 g.moveTo(0, Y(gy));
 g.lineTo(W, Y(gy));
 g.stroke();
 }
 g.strokeStyle = "#9ca3af";
 g.beginPath();
 g.moveTo(0, H / 2);
 g.lineTo(W, H / 2);
 g.moveTo(W / 2, 0);
 g.lineTo(W / 2, H);
 g.stroke();
 g.fillStyle = "#6b7280";
 g.font = "11px Arial";
 for (let t = -6; t <= 6; t += 2) {
 if (t !== 0) {
 g.fillText(String(t), X(t) - 4, H / 2 + 14);
 }
 }
 for (let t = -4; t <= 4; t += 2) {
 if (t !== 0) {
 g.fillText(String(t), W / 2 + 6, Y(t) + 4);
 }
 }
 g.strokeStyle = "#6d28d9";
 g.lineWidth = 3;
 g.beginPath();
 let pen = false;
 for (let px = 0; px <= W; px++) {
 let y = Y(f[0]((px - W / 2) / sx));
 if (y < -20 || y > H + 20) {
 pen = false;
 } else if (!pen) {
 g.moveTo(px, y);
 pen = true;
 } else {
 g.lineTo(px, y);
 }
 }
 g.stroke();
 let y0 = f[0](x0);
 let m = f[1](x0);
 g.strokeStyle = "#f59e0b";
 g.lineWidth = 2.5;
 g.beginPath();
 g.moveTo(X(x0 - 4), Y(y0 - 4 * m));
 g.lineTo(X(x0 + 4), Y(y0 + 4 * m));
 g.stroke();
 g.fillStyle = "#ef4444";
 g.strokeStyle = "#ffffff";
 g.lineWidth = 2;
 g.beginPath();
 g.arc(X(x0), Y(y0), 6, 0, 7);
 g.fill();
 g.stroke();
 let trend = "The curve is flat here, so the slope is about zero (a peak or a valley).";
 if (m > 0.05) {
 trend = "The curve is going up here, so the slope is positive.";
 } else if (m < -0.05) {
 trend = "The curve is going down here, so the slope is negative.";
 }
 getInput("xLabel").innerHTML = x0.toFixed(1);
 getInput("info").innerHTML = '<div class="grid">' + statCard("x", x0.toFixed(1)) + statCard("f(x) = " + name, y0.toFixed(2)) + statCard("f'(x) = " + derivatives[name], m.toFixed(2)) + "</div><p>" + trend + "</p>";
}

function chest(side) {
 return '<svg class="chest ' + side + '" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="28" width="52" height="28" rx="4" fill="#b45309"/><path d="M6 32 C6 14 58 14 58 32 Z" fill="#d97706"/><rect x="6" y="28" width="52" height="6" fill="#fbbf24"/><rect x="26" y="26" width="12" height="16" rx="3" fill="#fbbf24"/><circle cx="32" cy="34" r="2.5" fill="#78350f"/><rect x="6" y="50" width="52" height="6" rx="3" fill="#92400e"/></svg>';
}

function rankRows() {
 let list = db.users.filter(function (x) {
 return x.role === "student";
 }).sort(function (a, b) {
 return b.xp - a.xp;
 }).slice(0, 5);
 let html = "";
 list.forEach(function (s, i) {
 html += '<div class="rank"><span class="medal m' + (i + 1) + '">' + (i + 1) + '</span><span class="avatar">' + (s.pic ? '<img src="' + s.pic + '" alt="">' : escapeHtml(s.name[0])) + '</span><span class="who">' + escapeHtml(s.name) + '</span><span class="pts">' + s.xp + " XP</span></div>";
 });
 return html || "<p>No students yet.</p>";
}

pages.student.learn = function (u) {
 let colors = ["#77c93a", "#c084fc", "#38bdf8", "#f59e0b"];
 let n = 0;
 let html = '<div class="learn"><div><h2>Learn</h2>';
 db.courses.forEach(function (c) {
 if (!c.pub) {
 return;
 }
 let current = -1;
 c.levels.forEach(function (L, i) {
 if (current < 0 && !u.done[c.id + "-" + i] && unlocked(u, c, i)) {
 current = i;
 }
 });
 html += '<div class="unit" style="background-color:' + colors[n % colors.length] + '"><h3>Unit ' + (n + 1) + "</h3><p>" + escapeHtml(c.title) + '</p></div><div class="path">';
 c.levels.forEach(function (L, i) {
 let d = u.done[c.id + "-" + i];
 let open = unlocked(u, c, i);
 let shift = Math.round(Math.sin(i * 1.2) * 70);
 let state = d ? "done" : open ? "current" : "locked";
 let icon = d ? "&#10003;" : open ? "&#9733;" : "&#128274;";
 let label = escapeHtml(L.name) + (d ? "<br>" + "&#9733;".repeat(d.stars) : "");
 html += '<div class="step" style="transform:translateX(' + shift + 'px)">';
 if (i === current) {
 html += '<span class="start">START</span>' + chest(shift > 0 ? "left" : "right");
 }
 html += '<button class="node ' + state + '" ' + (open ? "" : "disabled") + ' onclick="startLevel(' + c.id + "," + i + ')">' + icon + "</button><small>" + label + "</small></div>";
 });
 if (c.levels.length === 0) {
 html += "<p>No levels yet.</p>";
 }
 html += "</div>";
 n++;
 });
 if (n === 0) {
 html += '<div class="card"><p>No courses are published yet.</p></div>';
 }
 let done = doneCount(u);
 let total = totalLevels();
 let percent = total ? Math.round(done / total * 100) : 0;
 html += '</div><div class="side">' +
 '<div class="card"><h3>Daily goal</h3><p>' + (u.last === dayString(0) ? "Goal met today. Great work!" : "Finish one level today.") + '</p><div class="bar"><i style="width:' + (u.last === dayString(0) ? 100 : 0) + '%"></i></div></div>' +
 '<div class="card"><h3>Classroom</h3>' + rankRows() + "</div>" +
 '<div class="card"><h3>XP progress</h3><p>Level ' + levelOf(u) + " - " + u.xp % 100 + ' / 100 XP</p><div class="bar"><i style="width:' + u.xp % 100 + '%"></i></div></div>' +
 '<div class="card"><h3>Course progress</h3><p>' + done + " of " + total + ' levels complete</p><div class="bar"><i style="width:' + percent + '%"></i></div></div>' +
 "</div></div>";
 return html;
};

pages.student.lesson = function () {
 let L = getCourse(lessonRef.c).levels[lessonRef.l];
 let ls = L.lesson;
 let html = "<h2>Level " + (lessonRef.l + 1) + ": " + escapeHtml(L.name) + '</h2><div class="card"><h3>The rule</h3><p class="formula">' + escapeHtml(ls.rule) + "</p><p>" + escapeHtml(ls.text) + "</p></div>";
 html += '<div class="card"><h3>Worked examples</h3>';
 ls.examples.forEach(function (e) {
 html += "<p><b>" + escapeHtml(e[0]) + "</b><br>" + escapeHtml(e[1]) + "</p>";
 });
 html += '</div><div class="card"><h3>Remember</h3><p>' + escapeHtml(ls.tip) + "</p></div>";
 html += '<div class="row"><button onclick="startQuiz(' + lessonRef.c + "," + lessonRef.l + ')">Start practice</button><button class="light" onclick="go(\'learn\')">Back to levels</button></div>';
 return html;
};

pages.student.quiz = function (u) {
 let z = quiz;
 let L = getCourse(z.c).levels[z.l];
 if (z.end) {
 return '<div class="card"><h2>' + (z.end.pass ? "Level complete!" : "Keep practising") + "</h2><p>Score " + z.right + "/" + z.end.n + " - " + (z.end.pass ? "*".repeat(z.end.stars) + " next level unlocked" : "You need 60% to unlock the next level.") + '</p><button onclick="go(\'learn\')">Back to levels</button></div>';
 }
 let t = L.tasks[z.i];
 return "<h2>" + escapeHtml(L.name) + " - Question " + (z.i + 1) + "/" + L.tasks.length + '</h2><div class="card"><h3>' + escapeHtml(t.q) + '</h3><form id="quizForm" novalidate>' +
 '<div class="form-group"><input type="text" id="ans" placeholder="Your answer, e.g. 3x^2"' + (z.shown ? " disabled" : "") + '><span class="error" id="ansError"></span></div><p>' + z.fb + '</p><button type="submit">' + (z.shown ? "Next" : "Check") + "</button></form></div>" + (L.lesson ? '<p><a onclick="startLevel(' + z.c + "," + z.l + ')">Review the lesson</a></p>' : "");
};

function practicePool(u) {
 let pool = [];
 db.courses.forEach(function (c) {
 if (!c.pub) {
 return;
 }
 c.levels.forEach(function (L, i) {
 if (unlocked(u, c, i)) {
 L.tasks.forEach(function (t) {
 pool.push({ q: t.q, a: t.a, level: L.name });
 });
 }
 });
 });
 return pool;
}

function startPractice() {
 let pool = practicePool(currentUser());
 pool.sort(function () {
 return Math.random() - 0.5;
 });
 practiceRun = { tasks: pool.slice(0, 5), i: 0, right: 0, shown: false, fb: "", end: false };
 currentPage = "practicerun";
 render();
}

pages.student.practice = function (u) {
 let pool = practicePool(u);
 let answered = u.pAns || 0;
 let correct = u.pOk || 0;
 let accuracy = answered ? Math.round(correct / answered * 100) : 0;
 let options = "";
 Object.keys(functions).forEach(function (k) {
 options += "<option>" + k + "</option>";
 });
 return banner("Practice", "Sharpen your skills with mixed questions, then see what a derivative looks like on a graph.") +
 '<div class="grid">' + statCard("Questions answered", answered) + statCard("Correct answers", correct) + statCard("Accuracy", accuracy + "%") + "</div>" +
 '<div class="card"><h3>Quick practice</h3><p>Five random questions from the levels you have unlocked. Each correct answer gives +5 XP.</p><button ' + (pool.length ? "" : "disabled") + ' onclick="startPractice()">Start quick practice</button></div>' +
 '<div class="card"><h3>Graph explorer</h3><p>Choose a function and move the slider. The orange line touches the curve at the red point, and its slope is the derivative at that point.</p><div class="row"><label>Function <select id="fn" onchange="drawGraph()">' + options + '</select></label><label>x = <b id="xLabel">1.0</b> <input type="range" id="x0" min="-4" max="4" step="0.1" value="1" oninput="drawGraph()"></label></div><canvas id="cv" width="720" height="380"></canvas><div id="info"></div></div>';
};

pages.student.practicerun = function () {
 let z = practiceRun;
 if (z.end) {
 return '<div class="card"><h2>Practice complete!</h2><p>You got ' + z.right + " of " + z.tasks.length + " correct and earned " + z.right * 5 + ' XP.</p><div class="row"><button onclick="startPractice()">Practise again</button><button class="light" onclick="go(\'practice\')">Back to practice</button></div></div>';
 }
 let t = z.tasks[z.i];
 return "<h2>Quick practice - Question " + (z.i + 1) + "/" + z.tasks.length + '</h2><div class="card"><small>From: ' + escapeHtml(t.level) + "</small><h3>" + escapeHtml(t.q) + '</h3><form id="practiceForm" novalidate><div class="form-group"><input type="text" id="pans" placeholder="Your answer, e.g. 3x^2"' + (z.shown ? " disabled" : "") + '><span class="error" id="pansError"></span></div><p>' + z.fb + '</p><button type="submit">' + (z.shown ? "Next" : "Check") + "</button></form></div>";
};

handlers.practiceForm = function () {
 let z = practiceRun;
 let u = currentUser();
 if (z.shown) {
 z.i++;
 z.shown = false;
 z.fb = "";
 if (z.i >= z.tasks.length) {
 z.end = true;
 addLog("Finished quick practice (" + z.right + "/" + z.tasks.length + ")");
 }
 render();
 return;
 }
 let ans = getInput("pans");
 if (ans.value.trim() === "") {
 showError(ans, "pansError", "Type your answer first.");
 return;
 }
 let correct = z.tasks[z.i].a.map(normalize).includes(normalize(ans.value));
 u.pAns = (u.pAns || 0) + 1;
 if (correct) {
 z.right++;
 u.pOk = (u.pOk || 0) + 1;
 award(u, 5);
 z.fb = "Correct! +5 XP";
 } else {
 z.fb = "Not quite. Answer: " + escapeHtml(z.tasks[z.i].a[0]);
 }
 saveData();
 z.shown = true;
 render();
};

pages.student.community = function (u) {
 return '<h2>Community</h2><div class="card"><form id="postForm" novalidate>' + field("postText", "Share something", "textarea") + '<button type="submit">Post</button></form></div>' + postList(u, false);
};

handlers.postForm = function () {
 if (checkText("postText", "Post", 5, 200)) {
 db.posts.unshift({ id: db.pid++, by: db.session, text: getInput("postText").value.trim(), time: new Date().toLocaleString(), likes: [], comments: [] });
 addLog("Shared a post");
 render();
 }
};

function likePost(id) {
 let p = db.posts.find(function (x) {
 return x.id === id;
 });
 let i = p.likes.indexOf(db.session);
 if (i < 0) {
 p.likes.push(db.session);
 } else {
 p.likes.splice(i, 1);
 }
 saveData();
 render();
}

function commentPost(id) {
 let text = prompt("Your comment (2 to 100 characters):");
 if (text === null) {
 return;
 }
 text = text.trim();
 if (text.length < 2 || text.length > 100) {
 alert("Comment must be 2 to 100 characters.");
 return;
 }
 db.posts.find(function (x) {
 return x.id === id;
 }).comments.push({ by: db.session, text: text });
 saveData();
 render();
}

function deletePost(id) {
 db.posts = db.posts.filter(function (p) {
 return p.id !== id;
 });
 addLog("Removed post " + id);
 render();
}

pages.student.complaint = function (u) {
 let rows = "";
 db.complaints.forEach(function (c) {
 if (c.by === u.id) {
 rows += "<tr><td>C-" + c.id + "</td><td>" + escapeHtml(c.text) + "</td><td>" + c.status + "</td></tr>";
 }
 });
 return '<h2>Submit a complaint</h2><div class="card"><form id="complaintForm" novalidate>' + field("complaintText", "Describe the problem", "textarea") + '<button type="submit">Submit complaint</button></form></div><table><tr><th>#</th><th>Issue</th><th>Status</th></tr>' + rows + "</table>";
};

handlers.complaintForm = function () {
 if (checkText("complaintText", "Complaint", 10, 200)) {
 db.complaints.unshift({ id: db.kid++, by: db.session, text: getInput("complaintText").value.trim(), status: "Pending" });
 addLog("Submitted a complaint");
 render();
 }
};

pages.student.results = function (u) {
 let list = (u.history || []).slice();
 if (list.length === 0) {
 Object.keys(u.done).forEach(function (k) {
 let parts = k.split("-");
 let c = getCourse(Number(parts[0]));
 let d = u.done[k];
 if (c && c.levels[parts[1]]) {
 list.push({ date: "-", course: c.title, level: c.levels[parts[1]].name, score: d.score, total: d.total, pass: true, stars: d.stars });
 }
 });
 }
 if (list.length === 0) {
 return '<h2>Exam results</h2><div class="card"><p>No results yet. Finish a level in Learn and your score will appear here.</p><button onclick="go(\'learn\')">Go to Learn</button></div>';
 }
 let sum = 0;
 let rows = "";
 list.forEach(function (r) {
 sum += r.score / r.total;
 rows += "<tr><td>" + r.date + "</td><td>" + escapeHtml(r.course) + "</td><td>" + escapeHtml(r.level) + "</td><td>" + r.score + "/" + r.total + "</td><td>" + (r.pass ? "Passed" : "Try again") + "</td><td>" + (r.pass ? "*".repeat(r.stars) : "-") + "</td></tr>";
 });
 return "<h2>Exam results</h2>" + '<div class="grid">' + statCard("Attempts", list.length) + statCard("Levels passed", doneCount(u) + " / " + totalLevels()) + statCard("Average score", Math.round(sum / list.length * 100) + "%") + "</div>" +
 "<table><tr><th>Date</th><th>Course</th><th>Level</th><th>Score</th><th>Result</th><th>Stars</th></tr>" + rows + "</table>";
};
