// defines the routing of front-end serving API endpoints from the database object.
// depends on /database/handle.js
'use strict';

module.exports = function(database) {
	function RouteGet(path, handler) {
		return {method: 'GET', path, handler};
	}
	const WebView = require('../views/webView')(database);

	return [
		RouteGet('/', (request, reply) => 'Hello'),
		RouteGet('/{name}', (request, reply) => `Hello, ${request.params.name}.`),
		RouteGet('/api/{search}',
			(request, reply) => `You searched for ${request.params.search}.`),
		RouteGet('/vibe', (request, reply) => database.GetVenuesAndBestVibes()),
		RouteGet('/api/vibe', (request, reply) => database.GetVenuesAndBestVibes()),
		RouteGet('/api/venues', (request, reply) => database.GetVenues(10)),
		RouteGet('/api/bestVibes', (request, reply) => database.GetBestVibes(5)),
		RouteGet('/api/venues/current', (request, reply) => database.GetNumberOfPeople()),
		RouteGet('/vibe.html', WebView),
	];
}
