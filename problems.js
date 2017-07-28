var fs = require("fs");
var csv = require("csv");
var user_service;

var problems = [];
var problems_str = "";

// 课号,题目内容,选项A,选项B,选项C,选项D,答案,是否打乱选项

// load problems from file
var load_problems_from_str = function(s) {
	csv.parse(s, function(err, data) {
		var new_problems = [];
		data.forEach(function(arr) {
			if (arr.length != 8) throw "invalid problem";
			new_problems.push({
				lesson : arr[0],
				description : arr[1],
				options : [arr[2], arr[3], arr[4], arr[5]],
				answer : arr[6],
				shuffle : (arr[7] == "1" ? true : false)
			});
		});
		problems = new_problems;
		problems_str = s;
	});
};

var load_problems_from_file = function(file_name) {
	var s = fs.readFileSync(file_name, "utf-8").trim();
	load_problems_from_str(s);
};

// initialization
load_problems_from_file("config/problems.csv");

var count_submissions = function() {
	var ret = [];
	var n = problems.length;
	for (var i = 0; i < n; i++) {
		ret[i] = {
			A : 0, B : 0, C : 0, D : 0
		};
	}
	var user_list = user_service.admin_get_user_list();
	var n_u = user_list.length;
	for (var i = 0; i < n_u; i++) {
		var sub = user_service.admin_get_submissions(user_list[i].user_name);
		for (var j = 0; j < n; j++) {
			if (sub[j] != "") {
				++ret[j][sub[j]];
			}
		}
	}
	
	return ret;
};

module.exports = {
	get_problems_str : function() {
		return problems_str;
	},
	get_problems : function() {
		return problems;
	},
	count_submissions : count_submissions
};

user_service = require("./user_service");

