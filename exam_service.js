var started = false;
var ended = false;
var t_remaining = -1;
var t_start = 0;
var t_tot = 0;


var has_started = function() {
	return started;
};

var has_ended = function() {
	return ended;
};

var do_start_exam = function(t) {
	started = true;
	t_start = new Date();
	t_remaining = t;
	t_tot = t;
	setTimeout(exam_tick_func, 1000);
};

var exam_tick_func = function() {
	var cur_date = new Date();
	var dt = (cur_date - t_start);
	dt -= dt % 1000;
	dt /= 1000;
	t_remaining = t_tot - dt;
	if (t_remaining <= 0) {
		t_remaining = 0;
		ended = true;
	} else {
		setTimeout(exam_tick_func, 1000);
	}
};

var get_remaining_time = function() {
	return t_remaining;
};

module.exports = {
	has_started : has_started,
	has_ended : has_ended,
	do_start_exam : do_start_exam,
	get_remaining_time : get_remaining_time
};
