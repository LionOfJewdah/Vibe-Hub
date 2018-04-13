// controller/upload.js
// defines POST API endpoint callbacks

const Config = require('../config/config');
const fs = require('fs');

function uploadPictures(request, reply) {
	const venue_ID = request.params.venue_ID,
		sensorType = request.params.sensorType;
	const query = request.query;
	const sensor_ID = query.sensor_ID;
	let files = request.payload.file;
	if (!Array.isArray(files)) files = [files];
	const WriteToUploads = (file, idx) => file.pipe(fs.createWriteStream(
		Config.UploadFolder + file.hapi.filename
	));
	files.forEach(WriteToUploads);

	const response = {
		venue_ID,
		sensorType
	}
	return response;
}

const venue_image_config = {
	payload: {
		output: "stream",
		parse: true,
		allow: ["multipart/form-data", "image/*"],
		maxBytes: 2 * 1024 * 1024
	}
};

module.exports = {
	VenuePictures: uploadPictures,
	venueImageConfig: venue_image_config
};
