'use strict';
var mongoose = require('mongoose');

var BestVibeSchema = new mongoose.Schema({
	name: String,
	venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
	img: String
}, {timestamps: false});

module.exports = mongoose.model('BestVibe', BestVibeSchema);
