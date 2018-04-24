// controller/upload.js
// defines POST API endpoint callbacks
'use strict';
const fs = require('fs'), path = require('path');
const mkdirp = require('mkdirp-promise');
const { MyTime, image_regex } = require('./util');
const Detect = require('./detect');
const { UploadFolder } = require('../config');
const { ResultFolder } = Detect;

async function uploadPictures(request, reply) {
	const theTime = MyTime();
	const dir = path.resolve(UploadFolder, theTime);
	const venue_ID = request.params.venue_ID;
	const sensor_ID = request.params.sensor_ID || request.query.sensor_ID || 1;
	let myPayload = {received: false, venue: venue_ID};
	return mkdirp(dir).then(async function() {
		let { file } = request.payload;
		if (Array.isArray(file)) file = files[0];
		return await WriteToUploads(file);
	}).catch((err) => {
		console.error(err, err.stack);
		return Promise.resolve(Object.assign(myPayload, {error: err}));
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
			`${venue_ID} ${sensor_ID}${ext}`);
		let output = file.pipe(fs.createWriteStream(destination));
		return new Promise((resolve, reject) => {
			output.on('close', async () => { 
				try {
					await Detect.Single(destination);
					resolve(reply.file(path.resolve(ResultFolder,
						`${venue_ID} ${sensor_ID}.jpg`)));
				} catch (error) { 
					reject(error);
				}
			});
		})

		
		return 
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
