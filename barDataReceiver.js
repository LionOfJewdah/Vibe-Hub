// barDataReceiver.js
// Receives semsor data from the raspberry pi over HTTP
// and sends it to be entered into the Mongo database
'use strict';
const { PeriodicEvents, Detect } = require('./controller');

function ListenOnHTTP(server, database, routes) {
	server.route(routes(database));
	Detect.Init(database.InsertCameraData.bind(database));
	PeriodicEvents.start();
}

module.exports = ListenOnHTTP;
