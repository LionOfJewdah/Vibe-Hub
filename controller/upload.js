// controller/upload.js
// defines POST API endpoint callbacks
'use strict';
const Config = require('../config');
const fs = require('fs'), path = require('path');
const database = require('../database/handle');
const mkdirp = require('mkdirp-promise');
const { MyTime, asyncForEach, image_regex } = require('./util');
const Detect = require('./detect');

async function uploadPictures(request, reply) {
	const theTime = MyTime();
	const dir = path.resolve(Config.UploadFolder, theTime);
	const venue_ID = request.params.venue_ID;
	const sensor_ID = request.params.sensor_ID || request.query.sensor_ID || 0;
	return mkdirp(dir).then(async function() {
		let files = request.payload.file;
		if (!Array.isArray(files)) files = [files];
		await asyncForEach(files, WriteToUploads);
		return Promise.resolve({received: true, venue: venue_ID});
	}).catch((err) => {
		console.error(err, err.stack);
		return Promise.resolve({received: false, venue: venue_ID, error: err});
	});
	async function WriteToUploads (file) {
		const fname = file.hapi.filename;
		const ext = path.extname(fname);
		if (!ext.match(image_regex)) {
			console.log("not a picture");
			return Promise.reject({received: false, venue: venue_ID,
				error: "not a picture"});
		}
		const filename = path.basename(fname).replace(/\s/g, '_');
		const destination = path.resolve(dir,
			filename + ` ${venue_ID} ${sensor_ID}${ext}`);
		let output = file.pipe(fs.createWriteStream(destination));
<<<<<<< HEAD
		output.on('close', () => {
=======
		output.on('close', async () => {
>>>>>>> 532730fa21338925191be5816f462651a5d4ae12
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
