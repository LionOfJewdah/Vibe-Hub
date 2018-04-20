// controller/upload.js
// defines POST API endpoint callbacks
'use strict';
const Config = require('../config');
const fs = require('fs'), path = require('path');
const database = require('../database/handle');
const mkdirp = require('mkdirp');
const MyTime = require('./util').Time_HH_MM;

async function uploadPictures(request, reply) {
	const theTime = MyTime();
	const dir = path.resolve(Config.UploadFolder, theTime);
	const venue_ID = request.params.venue_ID,
		sensorType = request.params.sensorType;
	const query = request.query;
	const sensor_ID = query.sensor_ID;
	try {
		await mkdirp(dir);
		let files = request.payload.file;
		if (!Array.isArray(files)) files = [files];
		function WriteToUploads (file) {
			const fname = file.hapi.filename;
			let dotPosition = (fname.lastIndexOf(".") - 1 >>> 0) + 2;
			const ext = fname.slice(dotPosition),
				filename = fname.slice(0, dotPosition - 1).replace(/\s/g, '_');
			file.pipe(fs.createWriteStream(
				path.resolve(dir, filename + ` ${venue_ID} ${sensor_ID}.${ext}`)
			));
		}
		await files.forEach(WriteToUploads);
		const response = {
			venue_ID,
			sensorType
		}
		return response;
	}
	catch (err) {
		console.error(err, err.stack);
		return err;
	}
}

const venue_image_config = {
	payload: {
		output: "stream",
		parse: true,
		allow: ["multipart/form-data", "image/*"],
		maxBytes: 8 * 1024 * 1024
	}
};

module.exports = {
	VenuePictures: uploadPictures,
	venueImageConfig: venue_image_config
};
