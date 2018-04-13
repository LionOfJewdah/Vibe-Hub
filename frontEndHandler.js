// frontEndHandler.js
// governs API calls from iOS and other front-ends

function frontEndHandler(server, database, routes) {
	this.server = server;
	this.database = database;
	server.route(routes(database));
}

module.exports = frontEndHandler;

