// controller/upload.js
// defines POST API endpoint callbacks
'use strict';
const Config = require('../config');
const fs = require('fs'), path = require('path');
const database = require('../database/handle');
const mkdirp = require('mkdirp-promise');
const { MyTime, asyncForEach } = require('./util');

async function uploadPictures(request, reply) {
	const theTime = MyTime();
	const dir = path.resolve(Config.UploadFolder, theTime);
	const venue_ID = request.params.venue_ID;
	const sensor_ID = request.query.sensor_ID;
	return mkdirp(dir).then(async function() {
		let files = request.payload.file;
		if (!Array.isArray(files)) files = [files];
		await asyncForEach(files, WriteToUploads);
		return Promise.resolve({received: true, venue: venue_ID});
	}).catch((err) => {
		console.error(err, err.stack);
		return Promise.reject({received: false, venue: venue_ID, error: err});
	});
	async function WriteToUploads (file) {
		const fname = file.hapi.filename;
		let dotPosition = (fname.lastIndexOf(".") - 1 >>> 0) + 2;
		const ext = fname.slice(dotPosition),
			filename = fname.slice(0, dotPosition - 1).replace(/\s/g, '_');
		file.pipe(fs.createWriteStream(
			path.resolve(dir, filename + ` ${venue_ID} ${sensor_ID}.${ext}`)
		));
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
