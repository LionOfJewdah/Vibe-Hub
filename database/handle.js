// database/handle.js
// Receives data from barDataReceiver.js and sends to frontEndHandler.js

const mongoose = require("mongoose");

var Venue, Sensor, Camera, CameraData, BestVibes;

function init(username = "", shibboleth = "") {
	const databaseName = "vibe";
	const hostname = "localhost";
	const mongo_port = 27017;
	var auth_schema = (username && shibboleth) ? `${username}:${shibboleth}@` : "";
	var mongoURI = `mongodb://${auth_schema}${hostname}:${mongo_port}/${databaseName}`;
	var mongoPathNoCredentials = `mongodb://${hostname}:${mongo_port}/${databaseName}`;

	mongoose.connect(mongoURI);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, "connection error:"));
	db.once('open', function() {
	  console.log(`Connected to Mongo via mongoose on ${mongoPathNoCredentials}`);
	  getVenuesAndBestVibes();
	});

	Venue = require('./models/Venue');
	Sensor = require('./models/Sensor');
	Camera = require('./models/Camera');
	CameraData = require('./models/CameraData');
	BestVibes = require('./models/BestVibes');
}

var handle = {
	venues: function () {

	},

	cameraData: function() {

	},

	InsertSensorData: insertSensorData,

	GetVenuesAndBestVibes: getVenuesAndBestVibes,

	GetVenues: getVenues,

	GetBestVibes: getBestVibes
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

async function getVenues(lim = 10) {
	const venueQuery = Venue.find().limit(lim).select("-_id").lean();
	return venueQuery.exec();
}

async function getBestVibes(lim = 5) {
	const bestVibesQuery = BestVibes.find().limit(lim).select("-_id").lean();
	return bestVibesQuery.exec();
}

async function getVenuesAndBestVibes() {
	try {
		var payload = {};
		payload.bars = await getVenues(lim = 10);
		payload.bestVibes = await getBestVibes(lim = 5);
		console.log("Payload:", JSON.stringify(payload));
		return payload;
	} catch (rejection) {
		console.log("Rejected because of:", rejection);
	}
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
	var cameraData = CameraData.create({
		number_of_people: value.numberOfPeople,
		venue_ID: value.venueID,
		camera_ID: value.cameraID
	}, cameraDataInsertCallback);
	return value.numberOfPeople;

	function cameraDataInsertCallback (err, docs) { // will improve
		if (err) {
			console.log("Camera data insert fail");
		}
		else {
			console.log("Inserted camera data", docs)
		}
	};
}

function InsertUltrasonicData(value) {

}

function InsertSoundData(value) {
	// TODO
}

init();

