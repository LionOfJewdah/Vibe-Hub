// defines the routing of back-end posting API endpoints from the database object.
// depends on /database/handle.js and /controller/
// TODO: a WIP

const { Upload, Detect } = require('../controller');

module.exports = function(database) {
	function RoutePost(path, handler, config) { 
		return {method: 'POST', path, handler, config};	
	}

	return [
		RoutePost('/api/post/venue/{venue_ID}/{sensorType}', Upload.VenuePictures,
			Upload.venueImageConfig)
	];
}
