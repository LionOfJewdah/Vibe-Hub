// database/handle.js
// Access point for database inserts, queries and serving
'use strict';

const mongoose = require('mongoose');
const { Venue, Sensor, Camera, CameraData, BestVibes } = require('./models');

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
}

const SensorType = Object.freeze({
	"camera": 1,
	"microphone": 2,
	"ultrasonic": 3,
});

function insertSensorData(sensorData) {
	const sensorType = SensorType[sensorData.sensorType] || SensorType.camera;
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

function ApplyCallback(obj, cb) {
	if (Array.isArray(obj)) {
		obj.forEach(cb);
	} else {
		cb(obj);
	}
}

function _InsertCameraData(sensorData) {
	let cameraData = CameraData.create(sensorData, cameraDataInsertCallback);
	function updateVenue(data) {
		const {venue_ID, numberOfPeople} = data;
		try {
			return Venue.where({venue_ID: venue_ID}).update({numberOfPeople}).then(
				() => { console.log(`venue ${venue_ID} updated.`); }
			).catch(cameraDataInsertCallback);
		} catch (err) {
			console.error("fuck");
		}
	}
	ApplyCallback(sensorData, updateVenue);

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
		payload.bars = await getVenues(10);
		payload.bestVibes = await getBestVibes(5);
		return payload;
	} catch (rejection) {
		console.log("Rejected because of:", rejection);
	}
}

async function getNumberOfPeople(lim = 10) {
	const peopleQuery = Venue.find().limit(lim).select("numberOfPeople name -_id").lean();
	return peopleQuery.exec();
}

module.exports = {
	InsertSensorData: insertSensorData,
	InsertCameraData: _InsertCameraData,
	GetVenuesAndBestVibes: getVenuesAndBestVibes,
	GetVenues: getVenues,
	GetBestVibes: getBestVibes,
	GetNumberOfPeople: getNumberOfPeople
}

init();
