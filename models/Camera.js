var mongoose = require('mongoose');

var CameraSchema = new mongoose.Schema({
  ID: {type: Number, unique: true, index: true},
	venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
	venue_ID: Number // e.g. this is the venue_ID'th sensor at bar/club "venue"
}, {timestamps: true});

module.exports = mongoose.model('Camera', CameraSchema);
