// controller/upload.js
// defines POST API endpoint callbacks
'use strict';
const Config = require('../config');
const fs = require('fs');
const {Detect} = require('./detect');
const database = require('../database/handle');

async function uploadPictures(request, reply) {
	const venue_ID = request.params.venue_ID,
		sensorType = request.params.sensorType;
	const query = request.query;
	const sensor_ID = query.sensor_ID;
	let files = request.payload.file;
	if (!Array.isArray(files)) files = [files];
	function WriteToUploads (file) {
		const fname = file.hapi.filename;
		let dotPosition = (fname.lastIndexOf(".") - 1 >>> 0) + 2;
		const ext = fname.slice(dotPosition),
			filename = fname.slice(0, dotPosition - 1).replace(/\s/g, '_') || 'dummy';
		file.pipe(fs.createWriteStream(
			Config.UploadFolder + filename + ` ${venue_ID} ${sensor_ID}.${ext}`
		));
	}
	await files.forEach(WriteToUploads);
	Detect(database.InsertCameraData);
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
