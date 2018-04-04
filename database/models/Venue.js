var mongoose = require('mongoose');

// US phone numbers
const phonePattern = /\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/;
// $1 is the area code, $2 is the next 3; $3 is last 4
// can replace with ($1) $2-$3 for nice formatting

var VenueSchema = new mongoose.Schema({
  venue_ID: {type: Number, required: [true, "can't be blank"], index: true, unique: true},
  name: {type: String, required: [true, "can't be blank"], index: true},
  location: String,
  numberOfPeople: Number,
  /* phone: {type: String, unique: true, 
    //required: [true, "can't be blank"], 
    match: [phonePattern, 'is invalid'], 
    index: true
  }, */
  about: String,
  img: String,
  category: String, // e.g. bar or club
  tags: [String], // e.g. "gay bar" or "Latin"
  sensors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' }]
}, {timestamps: false});

module.exports = mongoose.model('Venue', VenueSchema);
