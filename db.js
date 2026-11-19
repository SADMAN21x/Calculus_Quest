function defaultLevels() {
 return [
 { name: "Power Rule", lesson: {"rule": "d/dx (x^n) = n x^(n-1)", "text": "Bring the power down as a multiplier, then reduce the power by 1. A number in front of x stays and multiplies.", "examples": [["d/dx (x^4)", "Bring 4 down and make the power 3. Answer: 4x^3."], ["d/dx (3x^2)", "3 stays. Bring 2 down: 3 x 2 = 6, and the power becomes 1. Answer: 6x."], ["d/dx (x)", "x is x^1. Bring 1 down and the power becomes 0, and x^0 = 1. Answer: 1."]], "tip": "Write powers with ^, for example x^3."}, tasks: [
 { q: "d/dx (x^3)", a: ["3x^2"] },
 { q: "d/dx (5x^2)", a: ["10x"] },
 { q: "d/dx (x^10)", a: ["10x^9"] },
 { q: "d/dx (x)", a: ["1"] },
 { q: "d/dx (2x^4)", a: ["8x^3"] }] },
 { name: "Sum and Constant Rule", lesson: {"rule": "d/dx (f + g) = f' + g'    and    d/dx (constant) = 0", "text": "Differentiate each term separately. A plain number has no slope, so its derivative is 0. A number multiplying a term just stays in front.", "examples": [["d/dx (x^2 + 5x)", "Term by term: x^2 gives 2x and 5x gives 5. Answer: 2x + 5."], ["d/dx (x^3 - 4)", "x^3 gives 3x^2 and the constant 4 gives 0. Answer: 3x^2."]], "tip": "Signs stay the same: a minus stays a minus."}, tasks: [
 { q: "d/dx (x^2 + 3x)", a: ["2x+3", "3+2x"] },
 { q: "d/dx (7)", a: ["0"] },
 { q: "d/dx (4x^3 - x)", a: ["12x^2-1"] },
 { q: "d/dx (3x^2 + 5x - 4)", a: ["6x+5", "5+6x"] },
 { q: "d/dx (x^3 + x^2 + x)", a: ["3x^2+2x+1", "1+2x+3x^2"] }] },
 { name: "Trig and Exponential Basics", lesson: {"rule": "(sin x)' = cos x    (cos x)' = -sin x    (tan x)' = sec^2 x    (e^x)' = e^x    (ln x)' = 1/x", "text": "These are standard results to memorise. e^x is special because its derivative is itself.", "examples": [["d/dx (3 sin x)", "3 stays and sin x gives cos x. Answer: 3cos x."], ["d/dx (cos x)", "This is a memorised result with a minus sign. Answer: -sin x."]], "tip": "cos gets the minus sign when differentiated, sin does not."}, tasks: [
 { q: "d/dx (sin x)", a: ["cosx", "cos(x)"] },
 { q: "d/dx (cos x)", a: ["-sinx", "-sin(x)"] },
 { q: "d/dx (tan x)", a: ["sec^2x", "sec^2(x)", "1/cos^2x", "1/cos^2(x)"] },
 { q: "d/dx (e^x)", a: ["e^x"] },
 { q: "d/dx (ln x)", a: ["1/x", "x^-1"] }] },
 { name: "Product Rule", lesson: {"rule": "d/dx (u v) = u' v + u v'", "text": "When two functions are multiplied, differentiate the first and keep the second, then keep the first and differentiate the second, and add the two parts.", "examples": [["d/dx (x^2 sin x)", "u = x^2 and v = sin x, so u' = 2x and v' = cos x. Answer: 2x sin x + x^2 cos x."], ["d/dx (x e^x)", "u = x and v = e^x, so u' = 1 and v' = e^x. Answer: e^x + x e^x."]], "tip": "Name u and v first, write u' and v', then combine them."}, tasks: [
 { q: "d/dx (x^2 sin x)", a: ["2xsinx+x^2cosx", "x^2cosx+2xsinx"] },
 { q: "d/dx (x e^x)", a: ["e^x+xe^x", "xe^x+e^x", "e^x(1+x)", "(x+1)e^x"] },
 { q: "d/dx (x^2 e^x)", a: ["2xe^x+x^2e^x", "x^2e^x+2xe^x", "e^x(x^2+2x)", "(x^2+2x)e^x", "xe^x(x+2)"] },
 { q: "d/dx (x cos x)", a: ["cosx-xsinx", "-xsinx+cosx"] },
 { q: "d/dx (x^3 sin x)", a: ["3x^2sinx+x^3cosx", "x^3cosx+3x^2sinx"] }] },
 { name: "Quotient Rule", lesson: {"rule": "d/dx (u / v) = (u' v - u v') / v^2", "text": "For a fraction, the bottom squared goes underneath. On top: derivative of the top times the bottom, minus the top times the derivative of the bottom.", "examples": [["d/dx (x / (x + 1))", "u = x and v = x + 1, so u' = 1 and v' = 1. Top: 1(x + 1) - x(1) = 1. Answer: 1/(x+1)^2."], ["d/dx (1 / x)", "u = 1 and v = x, so u' = 0 and v' = 1. Top: 0 - 1 = -1. Answer: -1/x^2."]], "tip": "The order on top matters: u' v minus u v'."}, tasks: [
 { q: "d/dx (x / (x + 1))", a: ["1/(x+1)^2", "1/(1+x)^2"] },
 { q: "d/dx (1 / x)", a: ["-1/x^2", "-x^-2"] },
 { q: "d/dx (sin x / x)", a: ["(xcosx-sinx)/x^2", "(xcosx-sinx)/(x^2)"] },
 { q: "d/dx (e^x / x)", a: ["(xe^x-e^x)/x^2", "e^x(x-1)/x^2", "(e^x(x-1))/x^2"] }] },
 { name: "Chain Rule", lesson: {"rule": "d/dx f(g(x)) = f'(g(x)) x g'(x)", "text": "When one function is inside another, differentiate the outside and leave the inside alone, then multiply by the derivative of the inside.", "examples": [["d/dx (2x + 1)^3", "Outside: the power 3 comes down, giving 3(2x + 1)^2. Inside derivative: 2. Answer: 6(2x + 1)^2."], ["d/dx (sin 3x)", "Outside: sin gives cos 3x. Inside derivative: 3. Answer: 3cos(3x)."]], "tip": "Do not forget to multiply by the derivative of the inside."}, tasks: [
 { q: "d/dx (x^2 + 1)^3", a: ["6x(x^2+1)^2", "(x^2+1)^2(6x)", "6(x^2+1)^2x"] },
 { q: "d/dx (sin 2x)", a: ["2cos(2x)", "2cos2x", "cos(2x)2"] },
 { q: "d/dx (3x + 1)^4", a: ["12(3x+1)^3", "(3x+1)^312"] },
 { q: "d/dx (e^(2x))", a: ["2e^(2x)", "2e^2x", "e^(2x)2"] },
 { q: "d/dx (cos(x^2))", a: ["-2xsin(x^2)", "-2xsinx^2", "-sin(x^2)2x"] }] },
 { name: "Second Derivative", lesson: {"rule": "f''(x) is the derivative of f'(x)", "text": "Differentiate once to get f', then differentiate that result again.", "examples": [["Second derivative of x^3", "First: 3x^2. Second: 6x."], ["Second derivative of cos x", "First: -sin x. Second: -cos x."]], "tip": "The second derivative shows how the slope itself is changing."}, tasks: [
 { q: "Second derivative of x^3", a: ["6x"] },
 { q: "Second derivative of x^4", a: ["12x^2"] },
 { q: "Second derivative of sin x", a: ["-sinx", "-sin(x)"] },
 { q: "f(x) = x^2 + 3x. Find f''(x)", a: ["2"] }] },
 { name: "Slope at a Point", lesson: {"rule": "slope at x = a is f'(a)", "text": "First find the derivative, then substitute the x value into it.", "examples": [["Slope of y = x^2 at x = 3", "Derivative: 2x. At x = 3: 2 x 3 = 6."], ["Slope of y = x^3 at x = 1", "Derivative: 3x^2. At x = 1: 3 x 1 = 3."]], "tip": "On the Practice page, the orange tangent line has exactly this slope."}, tasks: [
 { q: "Slope of y = x^2 at x = 3", a: ["6"] },
 { q: "Slope of y = x^3 at x = 2", a: ["12"] },
 { q: "Slope of y = 2x^2 + x at x = 1", a: ["5"] },
 { q: "Slope of y = sin x at x = 0", a: ["1"] }] }
 ];
}

function seedData() {
 let u = function (id, name, email, pass, role, xp) {
 return { id: id, name: name, email: email, pass: pass, role: role, xp: xp || 0, streak: 0, last: "", done: {}, pic: "" };
 };
 return {
 v: 5, uid: 10, cid: 10, pid: 1, kid: 1,
 users: [
 u(1, "Admin", "admin@cq.com", "admin123", "admin"),
 u(2, "Prof Rahman", "teacher@cq.com", "teacher123", "teacher"),
 u(3, "Sadman", "student@cq.com", "student123", "student"),
 u(4, "Nusrat Subah", "officer@cq.com", "officer123", "officer")
 ],
 courses: [{ id: 1, title: "Differentiation Basics", pub: true, levels: defaultLevels() }],
 posts: [], complaints: [], tasks: [], logs: [], session: null
 };
}

let db = JSON.parse(localStorage.getItem("cqData"));

if (db === null) {
 db = seedData();
}

if (db.v < 3) {
 let first = db.courses.find(function (c) {
 return c.id === 1;
 });
 if (first) {
 first.levels = defaultLevels();
 } else {
 db.courses.unshift({ id: 1, title: "Differentiation Basics", pub: true, levels: defaultLevels() });
 }
 if (db.v !== 2) {
 db.users.forEach(function (u) {
 u.done = {};
 });
 }
 db.v = 3;
 saveData();
}

if (db.v < 5) {
 db.users = db.users.filter(function (x) {
 return ["jay@cq.com", "bridgette@cq.com", "steph@cq.com"].indexOf(x.email) < 0;
 });
 db.v = 5;
 saveData();
}

function saveData() {
 localStorage.setItem("cqData", JSON.stringify(db));
}

function currentUser() {
 return db.users.find(function (u) {
 return u.id === db.session;
 });
}

function userName(id) {
 let u = db.users.find(function (x) {
 return x.id === id;
 });
 return u ? u.name : "Deleted user";
}

function getCourse(id) {
 return db.courses.find(function (c) {
 return c.id === id;
 });
}

function addLog(message) {
 let u = currentUser();
 db.logs.unshift({ time: new Date().toLocaleString(), user: u ? u.name : "-", role: u ? u.role : "-", message: message });
 db.logs = db.logs.slice(0, 150);
 saveData();
}
