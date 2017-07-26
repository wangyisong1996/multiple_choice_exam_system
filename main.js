// main

var express = require("express");
var session = require("express-session");
var cookie_parser = require("cookie-parser");
var body_parser = require("body-parser");

var app = express();



/* site map
	/admin : admin page entry
*/

app.use(body_parser.urlencoded({extended: false}));
app.use(body_parser.json());
app.use(cookie_parser());
app.use(session({
	secret : "233333233332333233323333",
	name : "session_id",
	cookie : {maxAge : 1000 * 60 * 120},
	resave : false,
	saveUninitialized : true
}));

// 
app.get("/", function(req, res, err) {
	res.send("hello world");
});

// /admin/*
require("./admin")(app);

module.exports = app;
