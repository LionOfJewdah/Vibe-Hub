'use strict';
var mongoose = require('mongoose');

var SensorSchema = new mongoose.Schema({
	venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
	kind_of_sensor: String, // TODO: verify e.g. camera, microphone, ultrasonic
	kind_ID: Number, // foreign key, i.e. the Camera ID or Mic ID primary key in another schema
	venue_ID: Number
});

module.exports = mongoose.model('Sensor', SensorSchema);
