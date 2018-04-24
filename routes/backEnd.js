// defines the routing of back-end posting API endpoints from the database object.
// depends on /database/handle.js and /controller/
'use strict';
const Upload = require('../controller/upload');

module.exports = function() {
	function RoutePost(path, handler, config) {
		return {method: 'POST', path, handler, config};
	}

	const imageRoutes = [
		'/api/post/venue/{venue_ID}/{sensorType}',
		'/api/post/venue/{venue_ID}/{sensorType}/{sensor_ID}',
	]

	return [
		RoutePost(imageRoutes[0], Upload.VenuePictures,
			Upload.venueImageConfig),
		RoutePost(imageRoutes[1], Upload.VenuePictures,
			Upload.venueImageConfig)
	];
}
