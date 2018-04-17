var mongoose = require('mongoose');

var CameraDataSchema = new mongoose.Schema({
  numberOfPeople: Number,
  venue_ID: Number, // { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  camera_ID: {
  	type: Number, // e.g. this is the camera_ID'th sensor at bar/club "venue"
  	// { type: mongoose.Schema.Types.ObjectId, ref: 'Camera' },
  	alias: 'sensor_ID',
  }
}, {timestamps: true});

module.exports = mongoose.model('CameraData', CameraDataSchema);
