// main

var express = require("express");

var app = express();

// 
app.get("/", function(req, res, err) {
	res.send("hello world");
});

module.exports = app;
