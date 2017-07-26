var views = require("./views");
var problems = require("./problems");
var user_service = require("./user_service");
var exam_service = require("./exam_service");

var index = function(req, res, err) {
	if (!user_service.check_login(req)) {
		views.send_login_page(res);
	} else {
		views.send_main_page(res, user_service.get_user_name(req));
	}
	res.send();
};

var index_login = function(req, res, err) {
	if (user_service.check_login(req)) {
		return res.redirect("/");
	}
	if (!req.body.user_name || !req.body.password) {
		return res.redirect("/");
	}
	var user_name = req.body.user_name;
	var password = req.body.password;
	if (!user_service.check_password(user_name, password)) {
		return res.redirect("/");
	}
	user_service.do_login(req, user_name);
	res.redirect("/");
};

var index_logout = function(req, res, err) {
	if (user_service.check_login(req)) {
		user_service.do_logout(req);
	}
	return res.redirect("/");
};

var exam = function(req, res, err) {
	if (!user_service.check_login(req)) {
		return res.redirect("/");
	}
	if (!exam_service.has_started()) {
		views.send_wait_for_exam_page(res);
	} else if (exam_service.has_ended()) {
		views.send_score_page(res, user_service.get_user_name(req), user_service.get_score(req));
	} else {
		views.send_exam_page(res, user_service.get_user_name(req), problems.get_problems().length);
	}
	res.send();
};

module.exports = function(app) {
	app.get("/", index);
	app.post("/", index_login);
	app.post("/logout", index_logout);
	app.get("/exam", exam);
};
