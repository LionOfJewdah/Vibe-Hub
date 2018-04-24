// barDataReceiver.js
// Receives semsor data from the raspberry pi over HTTP
// and sends it to be entered into the Mongo database
'use strict';
const { PeriodicEvents, Detect } = require('./controller');

class BackEndListener {
	constructor(server, database, routes) {
		this.server = server;
		this.database = database;
		this.routes = routes;
		this.YOLO = Detect.Init(database.InsertCameraData.bind(database));
		this.periodic_events = PeriodicEvents.start();
		server.route(routes(database));
	}
}

function ListenOnHTTP(server, database, routes) {
	return new BackEndListener(server, database, routes);
}

module.exports = ListenOnHTTP;
