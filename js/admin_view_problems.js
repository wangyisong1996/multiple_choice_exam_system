var selected_pid = -1;
var n_problems = 0;
var problems = [];
var all_subs = [];

var select_problem = function(pid) {
	if (selected_pid != -1) {
		var td_pre = $("#problem_" + selected_pid);
		td_pre.removeClass("selected");
	}
	selected_pid = pid;
	var td = $("#problem_" + pid);
	td.addClass("selected");
	
	var prob = problems[pid];
	$("#problem_description").text(prob.description);
	$("#option_A").text("A. " + prob.options[0]);
	$("#option_B").text("B. " + prob.options[1]);
	$("#option_C").text("C. " + prob.options[2]);
	$("#option_D").text("D. " + prob.options[3]);
	
	for (var x in all_subs[pid]) {
		$("#count_" + x).text(all_subs[pid][x]);
	}
	
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
};

// load

$.ajax({
	url : "/admin/get_submissions",
	dataType : "json"
}).done(function(res) {
	all_subs = res;
	
	$.ajax({
		url : "/admin/get_problems",
		dataType : "json"
	}).done(function(res) {
		n_problems = res.length;
		problems = res;
		select_problem(0);
	});
});
