// database/handle.js
// Receives data from barDataReceiver.js and sends to frontEndHandler.js

const mongoose = require("mongoose");

const username = "", shibboleth = "";
const databaseName = "vibe";
var auth_schema = (username && shibboleth) ? `${username}:${shibboleth}@` : "";
var mongoURI = `mongodb://${auth_schema}${hostname}:${mongo_port}/${databaseName}`;
var mongoPathNoCredentials = `mongodb://${hostname}:${mongo_port}/${databaseName}`;

mongoose.connect(mongoURI);

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function() {
  console.log(`Connected to Mongo via mongoose on ${mongoPathNoCredentials}`);
});

var Venue = require('../models/Venue');
var Sensor = require('../models/Sensor');
var Camera = require('../models/Camera');
var CameraData = require('../models/CameraData');

var handle = {
	venues: function () {

	},

	cameraData: function() {

	},

	insertSensorData: insertSensorData,
}

module.exports = handle;


function insertSensorData(topic, sensorData) {
	//const key = topic.replace(baseTopic, "");
	const sensorType = getSensorType(topic);
	const clubID = getClubID(topic);
	var venueID = value.venueID,
	cameraID = value.cameraID;
	//venueID = Venue.where('ID').equals(venueID).cast();
	switch (sensorType) {
		case SensorType.camera:
			return InsertCameraData(sensorData);
		case SensorType.ultrasonic:
			return InsertUltrasonicData(sensorData);
		case SensorType.microphone:
			return InsertSoundData(sensorData);
	}
	return null;
}

const SensorType = Object.freeze({
	"camera": 1,
	"ultrasonic": 2,
	"microphone": 3,
});

function getSensorType(key) { // TODO: parse from data
	return SensorType.camera;
}

function InsertCameraData(value) {
	function cameraDataInsertCallback (err, docs) { // will improve
		if (err) {
			console.log("Camera data insert fail");
		}
		else {
			console.log("Inserted camera data", docs)
		}
	};

	var cameraData = CameraData.create({
		number_of_people: value.numberOfPeople,
		venue_ID: value.venueID,
		camera_ID: value.cameraID
	}, cameraDataInsertCallback);
	return value.numberOfPeople;
}

function InsertUltrasonicData(value) {

}

function InsertSoundData(value) {
	// TODO
}
