'use strict';
var mongoose = require('mongoose');

var VenueSchema = new mongoose.Schema({
  venue_ID: {type: Number, required: [true, "can't be blank"], index: true, unique: true, alias: 'ID'},
  name: {type: String, required: [true, "can't be blank"], index: true},
  location: String,
  numberOfPeople: Number,
  about: String,
  img: String,
  category: String, // e.g. bar or club
  tags: [String], // e.g. "gay bar" or "Latin"
  sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' }]
}, {timestamps: false});

module.exports = mongoose.model('Venue', VenueSchema);
