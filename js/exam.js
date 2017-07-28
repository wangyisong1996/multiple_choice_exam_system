var selected_pid = -1;
var n_problems = 0;
var problems = [];
var selections = [];
var selected_option = "";
var last_update_time = undefined;

var option_tds = {};

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
	
	option_tds.A.text("A. " + prob.options[0]);
	option_tds.B.text("B. " + prob.options[1]);
	option_tds.C.text("C. " + prob.options[2]);
	option_tds.D.text("D. " + prob.options[3]);
	
	if (selected_option != "") {
		option_tds[selected_option].removeClass("selected");
	}
	
	if (!!selections[pid] && selections[pid] != "") {
		selected_option = selections[pid];
		option_tds[selected_option].addClass("selected");
	}
	
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
};

var next_problem = function() {
	if (selected_pid == -1) return;
	select_problem((selected_pid + 1) % n_problems);
};

var prev_problem = function() {
	if (selected_pid == -1) return;
	select_problem((selected_pid + n_problems - 1) % n_problems);
};

var select_option = function(option) {
	if (selected_pid == -1) return;
	
	if (selected_option != "") {
		option_tds[selected_option].removeClass("selected");
	}
	selected_option = option;
	option_tds[selected_option].addClass("selected");
	selections[selected_pid] = selected_option;
	$("#problem_" + selected_pid).text(selected_pid + " " + selected_option);
	
	submit_selections();
};

// load

$.ajax({
	url : "/get_problems",
	dataType : "json"
}).done(function(res) {
	n_problems = res.length;
	if (n_problems == 0) return;
	
	var f = function(x) {option_tds[x] = $("#option_" + x);};
	f("A"), f("B"), f("C"), f("D");
	
	problems = res;
	for (var i = 0; i < n_problems; i++) {
		selections[i] = problems[i].selection;
		if (selections[i] != "") {
			$("#problem_" + i).text(i + " " + selections[i]);
		}
	}
	select_problem(0);
	setInterval(submit_selections, 5000);
});

var update_remaining_time = function() {
	$.ajax({
		url : "/get_remaining_time"
	}).done(function(res) {
		var s = parseInt(res);
		
		if (s <= 0) {
			alert("考试结束了！");
			window.location = "/";
		}
		
		var m = (s - s % 60) / 60;
		s = s % 60;
		$("#time_minutes").text(m);
		$("#time_seconds").text(s);
	});
	
	if (!!last_update_time) {
		var now_time = new Date();
		var dt = now_time - last_update_time;
		dt -= dt % 1000;
		dt /= 1000;
		$("#last_update_seconds").text(dt);
	}
};

// from [http://www.cnblogs.com/zhangpengshou/archive/2012/07/19/2599053.html]
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var submit_selections = function() {
	$.ajax({
		url : "/submit",
		method : "post",
		data : {
			time : (new Date().Format("yyyy-MM-ddThh:mm:ss.SZ")),
			selections : selections
		}
	}).done(function(res) {
		if (res == "success") {
			last_update_time = new Date();
		}
	});
};

update_remaining_time();
setInterval(update_remaining_time, 1000);
