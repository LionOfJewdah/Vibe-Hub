// frontEndHandler.js
// governs API calls from iOS and other front-ends

class FrontEndListener {
	constructor(server, database, routes) {
		this.server = server;
		this.database = database;
		this.routes = routes;
		server.route(routes(database));
	}
}

function frontEndHandler(server, database, routes) {
	return new FrontEndListener(server, database, routes);
}

module.exports = frontEndHandler;
