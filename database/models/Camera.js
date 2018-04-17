var mongoose = require('mongoose');

var CameraSchema = new mongoose.Schema({
  ID: {type: Number, unique: true, index: true},
	venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
	sensor_ID: Number
}, {timestamps: false});

module.exports = mongoose.model('Camera', CameraSchema);
