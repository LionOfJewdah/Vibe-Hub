var mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');

// US phone numbers
const phonePattern = /\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/;
// $1 is the area code, $2 is the next 3; $3 is last 4
// can replace with ($1) $2-$3 for nice formatting

var VenueSchema = new mongoose.Schema({
  ID: {type: Number, required: [true, "can't be blank"], index: true},
  name: {type: String, required: [true, "can't be blank"], index: true},
  location: String,
  //location: {type: } // TODO: figure out how locations should be stored
  phone: {type: String, unique: true, 
    //required: [true, "can't be blank"], 
    match: [phonePattern, 'is invalid'], 
  index: true
  },
  about: String,
  image: String,
  category: String, // e.g. bar or club
  tags: [String], // maybe e.g. "gay bar" or things could go here
  sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' }]
}, {timestamps: true});

module.exports = mongoose.model('Venue', VenueSchema);
