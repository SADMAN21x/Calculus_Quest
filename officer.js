pages.officer.complaints = function () {
 let rows = "";
 db.complaints.forEach(function (c) {
 let options = "";
 ["Pending", "In Progress", "Resolved"].forEach(function (s) {
 options += "<option" + (s === c.status ? " selected" : "") + ">" + s + "</option>";
 });
 rows += "<tr><td>C-" + c.id + "</td><td>" + escapeHtml(userName(c.by)) + "</td><td>" + escapeHtml(c.text) + '</td><td><select onchange="setStatus(' + c.id + ', this.value)">' + options + "</select></td></tr>";
 });
 return "<h2>Complaints</h2><table><tr><th>#</th><th>Student</th><th>Issue</th><th>Status</th></tr>" + rows + "</table>";
};

function setStatus(id, status) {
 db.complaints.find(function (c) {
 return c.id === id;
 }).status = status;
 addLog("Set complaint C-" + id + " to " + status);
}

pages.officer.review = function (u) {
 return "<h2>Content review</h2>" + postList(u, true);
};

pages.officer.students = function () {
 return "<h2>Student profiles</h2>" + studentTable();
};

pages.officer.sms = function () {
 let rows = "";
 db.users.forEach(function (s) {
 if (s.role === "student") {
 rows += "<tr><td>" + escapeHtml(s.name) + "</td><td>" + doneCount(s) + "/" + totalLevels() + " levels, " + s.xp + ' XP</td><td><button onclick="sendSms(' + s.id + ')">Send SMS</button></td></tr>';
 }
 });
 return "<h2>Send results to parents via SMS</h2><table><tr><th>Student</th><th>Result</th><th></th></tr>" + rows + "</table><small>Demo only. No real SMS is sent.</small>";
};

function sendSms(id) {
 let s = db.users.find(function (u) {
 return u.id === id;
 });
 let phone = prompt("Parent mobile number for " + s.name + ":");
 if (phone === null) {
 return;
 }
 if (!/^01[3-9][0-9]{8}$/.test(phone.trim())) {
 alert("Mobile must be 11 digits starting with 013-019.");
 return;
 }
 addLog("SMS to " + phone.trim() + ": " + s.name + " finished " + doneCount(s) + " levels with " + s.xp + " XP");
 alert("SMS queued (demo).");
}
