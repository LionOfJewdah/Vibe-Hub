'use strict';
var mongoose = require('mongoose');
const Sensor = require('./Sensor');

var CameraAdditions = new mongoose.Schema({
	ID: {type: Number, unique: true, index: true},
	venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
}, {discriminatorKey: 'kind'});

module.exports = Sensor.discriminator('Camera', CameraAdditions);
