var started = false;
var ended = false;
var t_remaining = -1;

var has_started = function() {
	return started;
};

var has_ended = function() {
	return ended;
};

module.exports = {
	has_started : has_started,
	has_ended : has_ended
};
