var fs = require("fs");
var htmlspecialchars = require("htmlspecialchars");

var _send_non_responsive_css = function(res) {
	res.write(`<style>
		/* Template-specific stuff
		 *
		  * Customizations just for the template; these are not necessary for anything
		   * with disabling the responsiveness.
		    */
		    
			/* Account for fixed navbar */
			
			body,
			.navbar-fixed-top,
			.navbar-fixed-bottom {
				  min-width: 1170px;
			}
			
			/* Don't let the lead text change font-size. */
			.lead {
				  font-size: 16px;
			}
			
			/* Finesse the page header spacing */
			.page-header {
				  margin-bottom: 30px;
			}
			.page-header .lead {
				  margin-bottom: 10px;
			}
			
			
			/* Non-responsive overrides
			 *
			  * Utilize the following CSS to disable the responsive-ness of the container,
			   * grid system, and navbar.
			    */
			    
				/* Reset the container */
				.container {
					  width: 1170px;
					    max-width: none !important;
				}
				
				/* Demonstrate the grids */
				/*.col-xs-4 {
					  padding-top: 15px;
					    padding-bottom: 15px;
						  background-color: #eee;
						    background-color: rgba(86,61,124,.15);
							  border: 1px solid #ddd;
							    border: 1px solid rgba(86,61,124,.2);
				}*/
				
				.container .navbar-header,
				.container .navbar-collapse {
					  margin-right: 0;
					    margin-left: 0;
				}
				
				/* Always float the navbar header */
				.navbar-header {
					  float: left;
				}
				
				/* Undo the collapsing navbar */
				.navbar-collapse {
					  display: block !important;
					    height: auto !important;
						  padding-bottom: 0;
						    overflow: visible !important;
							  visibility: visible !important;
				}
				
				.navbar-toggle {
					  display: none;
				}
				.navbar-collapse {
					  border-top: 0;
				}
				
				.navbar-brand {
					  margin-left: -15px;
				}
				
				/* Always apply the floated nav */
				.navbar-nav {
					  float: left;
					  /*   margin: 0; */
					      margin-left: 300px;
				}
				.navbar-nav > li {
					  float: left;
				}
				.navbar-nav > li > a {
					/*   padding: 15px; */
					    margin: 10px 10px 10px 10px;
							padding: 10px 10px 10px 10px;
								margin-top: 12px;
									margin-bottom: 12px;
										color: white;
				}
				
				/* Redeclare since we override the float above */
				.navbar-nav.navbar-right {
					  float: right;
				}
				
				/* Undo custom dropdowns */
				.navbar .navbar-nav .open .dropdown-menu {
					  position: absolute;
					    float: left;
						  background-color: #fff;
						    border: 1px solid #ccc;
							  border: 1px solid rgba(0, 0, 0, .15);
							    border-width: 0 1px 1px;
								  border-radius: 0 0 4px 4px;
								    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
									          box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
				}
				.navbar-default .navbar-nav .open .dropdown-menu > li > a {
					  color: #333;
				}
				.navbar .navbar-nav .open .dropdown-menu > li > a:hover,
				.navbar .navbar-nav .open .dropdown-menu > li > a:focus,
				.navbar .navbar-nav .open .dropdown-menu > .active > a,
				.navbar .navbar-nav .open .dropdown-menu > .active > a:hover,
				.navbar .navbar-nav .open .dropdown-menu > .active > a:focus {
					  color: #fff !important;
					    background-color: #428bca !important;
				}
				.navbar .navbar-nav .open .dropdown-menu > .disabled > a,
				.navbar .navbar-nav .open .dropdown-menu > .disabled > a:hover,
				.navbar .navbar-nav .open .dropdown-menu > .disabled > a:focus {
					  color: #999 !important;
					    background-color: transparent !important;
				}
				
				/* Undo form expansion */
				.navbar-form {
					  float: left;
					    width: auto;
						  padding-top: 0;
						    padding-bottom: 0;
							  margin-right: 0;
							    margin-left: 0;
								  border: 0;
								    -webkit-box-shadow: none;
									          box-shadow: none;
				}
				
				/* Copy-pasted from forms.less since we mixin the .form-inline styles. */
				.navbar-form .form-group {
					  display: inline-block;
					    margin-bottom: 0;
						  vertical-align: middle;
				}
				
				.navbar-form .form-control {
					  display: inline-block;
					    width: auto;
						  vertical-align: middle;
				}
				
				.navbar-form .form-control-static {
					  display: inline-block;
				}
				
				.navbar-form .input-group {
					  display: inline-table;
					    vertical-align: middle;
				}
				
				.navbar-form .input-group .input-group-addon,
				.navbar-form .input-group .input-group-btn,
				.navbar-form .input-group .form-control {
					  width: auto;
				}
				
				.navbar-form .input-group > .form-control {
					  width: 100%;
				}
				
				.navbar-form .control-label {
					  margin-bottom: 0;
					    vertical-align: middle;
				}
				
				.navbar-form .radio,
				.navbar-form .checkbox {
					  display: inline-block;
					    margin-top: 0;
						  margin-bottom: 0;
						    vertical-align: middle;
				}
				
				.navbar-form .radio label,
				.navbar-form .checkbox label {
					  padding-left: 0;
				}
				
				.navbar-form .radio input[type="radio"],
				.navbar-form .checkbox input[type="checkbox"] {
					  position: relative;
					    margin-left: 0;
				}
				
				.navbar-form .has-feedback .form-control-feedback {
					  top: 0;
				}
				
				/* Undo inline form compaction on small screens */
				.form-inline .form-group {
					  display: inline-block;
					    margin-bottom: 0;
						  vertical-align: middle;
				}
				
				.form-inline .form-control {
					  display: inline-block;
					    width: auto;
						  vertical-align: middle;
				}
				
				.form-inline .form-control-static {
					  display: inline-block;
				}
				
				.form-inline .input-group {
					  display: inline-table;
					    vertical-align: middle;
				}
				.form-inline .input-group .input-group-addon,
				.form-inline .input-group .input-group-btn,
				.form-inline .input-group .form-control {
					  width: auto;
				}
				
				.form-inline .input-group > .form-control {
					  width: 100%;
				}
				
				.form-inline .control-label {
					  margin-bottom: 0;
					    vertical-align: middle;
				}
				
				.form-inline .radio,
				.form-inline .checkbox {
					  display: inline-block;
					    margin-top: 0;
						  margin-bottom: 0;
						    vertical-align: middle;
				}
				.form-inline .radio label,
				.form-inline .checkbox label {
					  padding-left: 0;
				}
				
				.form-inline .radio input[type="radio"],
				.form-inline .checkbox input[type="checkbox"] {
					  position: relative;
					    margin-left: 0;
				}
				
				.form-inline .has-feedback .form-control-feedback {
					  top: 0;
				}
				
				
				table > caption {
					padding-top: 0px;
					padding-bottom: 2px;
					text-align: center;
					font-size: 16px;
				}
				
				.table-borderless > tbody > tr > td,
				.table-borderless > tbody > tr > th,
				.table-borderless > tfoot > tr > td,
				.table-borderless > tfoot > tr > th,
				.table-borderless > thead > tr > td,
				.table-borderless > thead > tr > th {
				    border: none;
				}
				
				th, td {
					text-align: center;
				}
				
				td.selected {
					background-color: #ddd
				}

		</style>`);
};

var _send_normal_header = function(res, title) {
	res.write(`
		<!DOCTYPE html>
		<html>
		<head>
		<meta charset="utf-8">
		<title>` + title + `</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"crossorigin="anonymous">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" crossorigin="anonymous">
		<script src="https://code.jquery.com/jquery-3.2.1.min.js" crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" crossorigin="anonymous"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML"></script>
		<script type="text/x-mathjax-config">
			MathJax.Hub.Config({
				showProcessingMessages: false,
				tex2jax: {
					inlineMath: [["$", "$"]],
					processEscapes:true
				},
				menuSettings: {
					zoom: "Hover"
    			}
			});
		</script>
		`);
	_send_non_responsive_css(res);
	res.write(`
		</head>
		<body>
			<script> document.body.style.zoom = 0.9 * Math.max(window.screen.width, 1440) / 1440; </script>
		`);
};

var send_admin_header = function(res, title) {
	_send_normal_header(res, title);
	res.write(`
			<p><a href="/admin">Back</a></p>
			<div class="container">
		`);
};

var send_header = undefined;

var send_admin_footer = function(res) {
	res.write(`
			</div>
		</body>
		</html>
		`);
};

// var send_admin_edit_problems = function(res, problems_str) {
// 	res.write(`
// 		<form action="/admin/edit_problems" method="post">
// 			<textarea name="problems" cols="50" rows="10">` + htmlspecialchars(problems_str) + `</textarea>
// 			<input type=
// 		</form>
// 		`);
// };

var send_admin_view_problems = function(res, problems) {
	res.write(`<div class="row">`);
	res.write(`<div class="col-xs-8">`);
	
	{
		res.write(`<h3> 题目描述 </h3>`);
		res.write(`<p id="problem_description"> Loading ... </p>`);
		res.write(`<h3> 选项 </h3>`);
		res.write(`<p>`);
		res.write(`<table><tr>`);
		res.write(`<td id="option_A" class="col-xs-2"></td>`);
		res.write(`<td id="option_B" class="col-xs-2"></td>`);
		res.write(`<td id="option_C" class="col-xs-2"></td>`);
		res.write(`<td id="option_D" class="col-xs-2"></td>`);
		res.write(`</tr></table>`);
		res.write(`</p>`);
	}
	
	res.write(`</div>`);
	res.write(`<div class="col-xs-4">`);
	
	{
		res.write(`<table class="table table-bordered">`);
		res.write(`<caption>题目列表</caption>`);
		var n = problems.length;
		var lines = (n - 1) / 8 + 1;
		for (var i = 0; i < lines; i++) {
			res.write(`<tr>`);
			var l = i * 8;
			var r = l + 8 - 1;
			if (n - 1 < r) r = n - 1;
			for (var j = l; j <= r; j++) {
				res.write(`<td id="problem_` + j + `" class="col-xs-1" onclick="select_problem(` + j + `);">`);
				res.write(j + "");
				res.write(`</td>`);
			}
			res.write(`</tr>`);
		}
		res.write(`</table>`);
	}
	
	{
		res.write(`<script>`);
		res.write(fs.readFileSync("js/admin_view_problems.js", "utf-8"));
		res.write(`</script>`);
	}
	
	res.write(`</div>`);
	res.write(`</div>`);
};

var send_login_page = function(res) {
	res.write(fs.readFileSync("login.html", "utf-8"));
};

var send_main_page = function(res, user_name) {
	res.write(fs.readFileSync("main.html", "utf-8").replace("{user_name}", htmlspecialchars(user_name)));
};

module.exports = {
	send_header : send_header,
	send_admin_header : send_admin_header,
	send_admin_footer : send_admin_footer,
	send_admin_view_problems : send_admin_view_problems,
	send_login_page : send_login_page,
	send_main_page : send_main_page
};
