// database/handle.js
// Access point for database inserts, queries and serving
'use strict';

const mongoose = require('mongoose');
const { Venue, CameraData, BestVibes } = require('./models');

function init(username = "", shibboleth = "") {
	const database = "vibe";
	const host = "localhost";
	const port = 27017;
	const auth = (username && shibboleth) ? `${username}:${shibboleth}@` : "";
	const mongoURI = `mongodb://${auth}${host}:${port}/${database}`;
	const mongoPathNoCredentials = `mongodb://${host}:${port}/${database}`;

	mongoose.connect(mongoURI);

	let db = mongoose.connection;
	db.on('error', console.error.bind(console, "connection error:"));
	db.once('open', function() {
		console.log('Connected to Mongo on', mongoPathNoCredentials);
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

function _InsertCameraData(sensorData) {
	if (IsNothing(sensorData)) {
		return;
	}
	try {
		let cameraData = CameraData.create(sensorData, onCameraDataInsert);
		ApplyCallback(sensorData, updateVenue);
	} catch (err) {
		/*console.error(`[${new Date()}]:`, "Camera data insert fail:",
			err, err.stack);*/
	}

	function updateVenue(data) {
		const {venue_ID, numberOfPeople} = data;
		return setVenuePopulation(venue_ID, numberOfPeople);
	}

	function onCameraDataInsert(err) {
		if (err) {
			/*console.error(`[${new Date()}]:`, "Camera data insert fail:",
				err, err.stack);*/
		} else {
			//console.log(`[${new Date()}]:`, "Inserted camera data");
		}
	}
}

function _InsertUltrasonicData(sensorData) {

}

function _InsertSoundData(sensorData) {

}

async function setVenuePopulation(venue_ID, numberOfPeople) {
	try {
		await Venue.where({venue_ID}).update({numberOfPeople});
		/*console.log(`venue ${venue_ID} updated to`,
			numberOfPeople, "people.");*/
		return { venue_ID, numberOfPeople, updated: true };
	} catch (err) {
		/*onsole.error(`Error updating venue ${venue_ID} to`,
			numberOfPeople, "people.");*/
		return { venue_ID, numberOfPeople, updated: false };
	}
}

async function setVenueCapacity(venue_ID, capacity) {
	try {
		await Venue.where({venue_ID}).update({capacity});
		//console.log(`venue ${venue_ID} updated to capacity ${capacity}.`);
		return { venue_ID, capacity, updated: true };
	} catch (err) {
		/*console.error(`Error updating venue ${venue_ID} to`,
			`capacity ${capacity}.`);*/
		return { venue_ID, capacity, updated: false };
	}
}

function ApplyCallback(obj, cb) {
	if (Array.isArray(obj)) {
		obj.forEach(cb);
	} else {
		cb(obj);
	}
}

function IsNothing(data) {
	return !data || data.length === 0;
}

async function getVenues(lim = 10) {
	const venueQuery = Venue.find().limit(lim).select("-_id").lean();
	return venueQuery.exec();
}

async function getBestVibes(lim = 5) {
	const bestVibesQuery = BestVibes.find().limit(lim)
		.select("-_id").lean();
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
	try {
		const peopleQuery = Venue.find().limit(lim)
			.select("numberOfPeople name -_id").lean();
		return peopleQuery.exec();
	} catch (rejection) {
		console.log("Rejected because of:", rejection);
	}
}

module.exports = {
	InsertSensorData: insertSensorData,
	InsertCameraData: _InsertCameraData,
	GetVenuesAndBestVibes: getVenuesAndBestVibes,
	GetVenues: getVenues,
	GetBestVibes: getBestVibes,
	GetNumberOfPeople: getNumberOfPeople,
	SetVenueCapacity: setVenueCapacity,
	SetVenuePopulation: setVenuePopulation,
};

init();
