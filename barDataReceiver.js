// barDataReceiver.js
// Receives semsor data from the raspberry pi over MQTT
// and sends it to be entered into the Mongo database
'use strict';
function ListenOnHTTP(server, database, routes) {
	server.route(routes(database));
}

module.exports = ListenOnHTTP;
