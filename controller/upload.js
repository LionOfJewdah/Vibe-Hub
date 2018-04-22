// controller/upload.js
// defines POST API endpoint callbacks
'use strict';
const Config = require('../config');
const fs = require('fs'), path = require('path');
const database = require('../database/handle');
const mkdirp = require('mkdirp-promise');
const { MyTime, asyncForEach } = require('./util');
const Detect = require('./detect');

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
		const ext = path.extname(fname),
			filename = path.basename(fname).replace(/\s/g, '_');
		const destination = path.resolve(dir,
			filename + ` ${venue_ID} ${sensor_ID}${ext}`);
		let output = file.pipe(fs.createWriteStream(destination));
		output.on('close', () => {
			Detect.Single(destination);
		})
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
