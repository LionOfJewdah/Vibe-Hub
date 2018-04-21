// barDataReceiver.js
// Receives semsor data from the raspberry pi over HTTP
// and sends it to be entered into the Mongo database
'use strict';
const periodic_events = require('./controller/periodic_events');

function ListenOnHTTP(server, database, routes) {
	server.route(routes(database));
	periodic_events.start(database);
}

module.exports = ListenOnHTTP;
