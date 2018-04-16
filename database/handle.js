// database/handle.js
// Access point for database inserts, queries and serving
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
	});

	Venue = require('./models/Venue');
	Sensor = require('./models/Sensor');
	Camera = require('./models/Camera');
	CameraData = require('./models/CameraData');
	BestVibes = require('./models/BestVibes');
}

function insertSensorData(sensorData) {
	const sensorType = SensorType[sensorData.sensorType];
	switch (sensorType) {
		case SensorType.camera:
			return _InsertCameraData(sensorData);
		case SensorType.ultrasonic:
			return _InsertUltrasonicData(sensorData);
		case SensorType.microphone:
			return _InsertSoundData(sensorData);
	}
	return null;
}

const SensorType = Object.freeze({
	"camera": 1,
	"ultrasonic": 2,
	"microphone": 3,
});

function _InsertCameraData(sensorData) {
	const venueID = sensorData.venueID;
	const numberOfPeople = sensorData.numberOfPeople;
	var cameraData = CameraData.create({
		numberOfPeople: numberOfPeople,
		venue_ID: venueID,
		camera_ID: sensorData.sensorID || 1
	}, cameraDataInsertCallback);
	Venue.where({venue_ID: venueID}).update({numberOfPeople: numberOfPeople}).then(
		() => console.log(`venue ${venueID} updated.`)
	);
	return sensorData.numberOfPeople;

	function cameraDataInsertCallback(err, docs) {
		if (err) {
			console.log("Camera data insert fail");
		} else {
			console.log("Inserted camera data");
		}
	};
}

function _InsertUltrasonicData(sensorData) {

}

function _InsertSoundData(sensorData) {
	
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
		return payload;
	} catch (rejection) {
		console.log("Rejected because of:", rejection);
	}
}

//function to constantly get the new number of people
async function getNumberOfPeople(lim = 10) {
	const peopleQuery = Venue.find().limit(lim).select("numberOfPeople name -_id").lean();
	return peopleQuery.exec();
}

var module_interface = {
	InsertSensorData: insertSensorData,

	GetVenuesAndBestVibes: getVenuesAndBestVibes,

	GetVenues: getVenues,

	GetBestVibes: getBestVibes,

	GetNumberOfPeople: getNumberOfPeople
}

module.exports = module_interface;

init();

