// index

var express = require("express");

var app = express();

app.get("/", function(req, res, err) {
	res.write("hello world");
	res.send();
});

var port = parseInt(process.argv[2]);
if (isNaN(port) || port <= 0 || port > 65535) {
	port = 23333;
}
console.log("listening on :" + port + " ...");
app.listen(port);

