// defines the routing of back-end posting API endpoints from the database object.
// depends on /database/handle.js and /controller/
'use strict';
const Upload = require('../controller/upload');

module.exports = function(database) {
	const imageRoutes = [
		'/api/post/venue/{venue_ID}/{sensorType}',
		'/api/post/venue/{venue_ID}/{sensorType}/{sensor_ID}',
	]

	return [
		RoutePost(imageRoutes[0], Upload.VenuePictures,
			Upload.venueImageConfig),
		RoutePost(imageRoutes[1], Upload.VenuePictures,
			Upload.venueImageConfig),
		RouteAny('/api/post/venue/{venue_ID}/capacity/{capacity}',
			(request, reply) => setVenueCapacity(request, reply)),
	];

	function RoutePost(path, handler, config) {
		return {method: 'POST', path, handler, config};
	}

	function RouteAny(path, handler, config) {
		return { method: '*', path, handler, config };
	}

	async function setVenueCapacity(request, reply) {
		const venue_ID = request.params.venue_ID,
			capacity = request.params.capacity;
		return await database.SetCapacity(venue_ID, capacity);
	}
}
