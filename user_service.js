var fs = require("fs");
var csv = require("csv");
var md5 = require("md5");
var problems = require("./problems");

var users = {};

var init_user_profile = function(profile, user_name) {
	var md5_str = md5(user_name);
	var seed = parseInt(md5_str.substr(5, 7), 16);
	var next_int = function() {
		return seed = seed * 16807 % 2147483647;
	};
	var gen_random_permutation = function(n) {
		var ret = [];
		for (var i = 0; i < n; i++) {
			ret[i] = i;
		}
		for (var i = 0; i < n; i++) {
			var j = next_int() % (i + 1);
			if (j != i) {
				var tmp = ret[i];
				ret[i] = ret[j];
				ret[j] = tmp;
			}
		}
		return ret;
	};
	var get_inverse = function(l) {
		var n = l.length;
		var ret = [];
		for (var i = 0; i < n; i++) {
			ret[l[i]] = i;
		}
		return ret;
	};
	
	var all_problems = problems.get_problems();
	var n_problems = all_problems.length;
	profile.problem_map = gen_random_permutation(n_problems);
	profile.problem_map_inverse = get_inverse(profile.problem_map);
	profile.problems = [];
	profile.score = 0;
	profile.last_submit_time = new Date();
	for (var i = 0; i < n_problems; i++) {
		profile.problems.push({
			selection : ""
		});
		if (!all_problems[i].shuffle) {
			profile.problems[i].option_map = [0, 1, 2, 3];
		} else {
			profile.problems[i].option_map = gen_random_permutation(4);
		}
		profile.problems[i].option_map_inverse = get_inverse(profile.problems[i].option_map);
	}
};

var init_users = function() {
	var s = fs.readFileSync("config/users.csv", "utf-8").trim();
	csv.parse(s, function(err, data) {
		var new_users = {};
		data.forEach(function(arr) {
			new_users[arr[0]] = {
				password : arr[1]
			};
			init_user_profile(new_users[arr[0]], arr[0]);
		});
		users = new_users;
	});
};

init_users();


var check_login = function(req) {
	return req.session.user_login == "Yes";
};

var check_password = function(user_name, password) {
	return !!users[user_name] && users[user_name].password == password;
};

var do_login = function(req, user_name) {
	req.session.user_login = "Yes";
	req.session.user_name = user_name;
};

var do_logout = function(req) {
	req.session.user_login = undefined;
};

var get_user_name = function(req) {
	return req.session.user_name;
};

var get_score = function(req) {
	return users[req.session.user_name].score;
};

var dump = function() {
	return users;
};

var get_problems = function(req) {
	var user_name = req.session.user_name;
	var prof = users[user_name];
	var all_problems = problems.get_problems();
	
	var ret = [];
	var n = all_problems.length;
	for (var i = 0; i < n; i++) {
		var id = prof.problem_map[i];
		var option_map = prof.problems[id].option_map;
		var options = [];
		for (var j = 0; j < 4; j++) {
			options[j] = all_problems[id].options[option_map[j]];
		}
		var P = {
			description : all_problems[id].description,
			options : options,
			selection : prof.problems[id].selection
		};
		ret[i] = P;
	}
	
	return ret;
};

var submit = function(req) {
	// console.log("submit : " + JSON.stringify(req.body));
	var user_name = req.session.user_name;
	var prof = users[user_name];
	var all_problems = problems.get_problems();
	var n = all_problems.length;
	
	var t = new Date(req.body.time);
	if (!t || !(t > prof.last_submit_time)) {
		return false;
	}
	
	var selections = req.body["selections[]"];
	if (!selections || !selections.length || selections.length !== n) {
		return false;
	}
	
	for (var i = 0; i < n; i++) {
		var tmp = selections[i];
		if (tmp != "" && tmp != "A" && tmp != "B" && tmp != "C" && tmp != "D") {
			return false;
		}
	}
	
	prof.last_submit_time = t;
	
	var score = 0;
	for (var i = 0; i < n; i++) {
		var pid = prof.problem_map[i];
		prof.problems[pid].selection = selections[i];
		if (selections[i] != "") {
			var tmp = {
				A : 0,
				B : 1,
				C : 2,
				D : 3
			}[selections[i]];
			if (["A", "B", "C", "D"][prof.problems[pid].option_map[tmp]] == all_problems[pid].answer) {
				++score;
			}
		}
	}
	score = score * 100 * 100;
	score -= score % n;
	score /= n;
	score /= 100;
	prof.score = score;
	
	return true;
};

var admin_get_user_list = function() {
	var ret = [];
	for (var u in users) {
		ret.push({
			user_name : u,
			score : users[u].score
		});
	}
	return ret;
};

var admin_get_submissions = function(user_name) {
	var ret = [];
	var prof = users[user_name];
	var n = problems.get_problems().length;
	for (var i = 0; i < n; i++) {
		var tmp = prof.problems[i].selection;
		if (tmp != "") {
			tmp = {
				A : 0,
				B : 1,
				C : 2,
				D : 3
			}[tmp];
			tmp = ["A", "B", "C", "D"][prof.problems[i].option_map[tmp]];
		}
		ret.push(tmp);
	}
	return ret;
};

module.exports = {
	check_login : check_login,
	check_password : check_password,
	do_login : do_login,
	do_logout : do_logout,
	get_user_name : get_user_name,
	get_score : get_score,
	dump : dump,
	get_problems : get_problems,
	submit : submit,
	admin_get_user_list : admin_get_user_list,
	admin_get_submissions : admin_get_submissions
};
