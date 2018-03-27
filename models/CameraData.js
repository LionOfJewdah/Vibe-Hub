var mongoose = require('mongoose');

var CameraDataSchema = new mongoose.Schema({
  number_of_people: Number,
	venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
	camera_ID: Number // e.g. this is the venue_ID'th sensor at bar/club "venue"
	// { type: mongoose.Schema.Types.ObjectId, ref: 'Camera' }
}, {timestamps: true});

module.exports = mongoose.model('CameraData', CameraDataSchema);
