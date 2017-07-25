// index

var port = parseInt(process.argv[2]);
if (isNaN(port) || port <= 0 || port > 65535) {
	port = 23333;
}

var main = require("./main");

console.log("listening on :" + port + " ...");
main.listen(port);

