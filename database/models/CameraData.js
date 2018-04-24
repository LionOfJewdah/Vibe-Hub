'use strict';
var mongoose = require('mongoose');

var CameraDataSchema = new mongoose.Schema({
	numberOfPeople: Number,
	venue_ID: Number,
	camera_ID: {
		type: Number,
		alias: 'sensor_ID'
	}
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('CameraData', CameraDataSchema);
