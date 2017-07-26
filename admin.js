var fs = require("fs");
var problems = require("./problems");
var views = require("./views");
var exam_service = require("./exam_service");
var user_service = require("./user_service");

var admin_password = fs.readFileSync("config/admin_password.txt", "utf-8").split("\n")[0];
if (!admin_password || admin_password == "") {
	throw "invalid admin password!";
}


var check_admin_login = function(req) {
	return req.session.admin_login == "Yes";
};

var do_admin_login = function(req) {
	req.session.admin_login = "Yes";
};

var do_admin_logout = function(req) {
	req.session.admin_login = undefined;
};

var check_password = function(req) {
	return req.body.password == admin_password;
};




var main = function(req, res, err) {
	if (!check_admin_login(req)) {
		res.sendFile("admin_login.html", {root: "."});
	} else {
		res.sendFile("admin_main.html", {root: "."});
	}
};

var login = function(req, res, err) {
	if (check_password(req)) {
		do_admin_login(req);
	}
	res.redirect("/admin");
};

var logout = function(req, res, err) {
	do_admin_logout(req);
	res.redirect("/admin");
};

// var edit_problems = function(req, res, err) {
// 	if (!check_admin_login(req)) return res.redirect("/admin");
// 	views.send_admin_header(res, "Edit Problems");
// 	views.send_admin_edit_problems(res, problems.get_problems_str());
// 	views.send_admin_footer(res);
// };

var view_problems = function(req, res, err) {
	if (!check_admin_login(req)) return res.redirect("/admin");
	views.send_admin_header(res, "View Problems");
	views.send_admin_view_problems(res, problems.get_problems());
	views.send_admin_footer(res);
	res.send();
};

var get_problems = function(req, res, err) {
	if (!check_admin_login(req)) return res.redirect("/admin");
	res.json(problems.get_problems());
};

var dump = function(req, res, err) {
	if (!check_admin_login(req)) return res.redirect("/admin");
	res.json(user_service.dump());
};

var start_exam = function(req, res, err) {
	if (!check_admin_login(req)) return res.redirect("/admin");
	if (exam_service.has_started()) return res.redirect("/admin");
	var t = parseInt(req.body.time);
	if (t >= 10 && t <= 60 * 60 * 24 * 1000) {
		exam_service.do_start_exam(t);
	}
	res.redirect("/admin");
};

module.exports = function(app) {
	app.get("/admin", main);
	app.post("/admin/login", login);
	app.post("/admin/logout", logout);
	// app.get("/admin/edit_problems", edit_problems);
	app.get("/admin/view_problems", view_problems);
	app.get("/admin/get_problems", get_problems);
	app.get("/admin/dump", dump);
	app.post("/admin/start_exam", start_exam);
};