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
	for (var i = 0; i < n_problems; i++) {
		profile.problems.push({
			selected : ""
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

module.exports = {
	check_login : check_login,
	check_password : check_password,
	do_login : do_login,
	do_logout : do_logout,
	get_user_name : get_user_name
};
