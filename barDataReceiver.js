// barDataReceiver.js
// Receives data from the raspberry pi over MQTT
// and enters it into the Mongo database

const mongoose = require("mongoose");
const mqtt = require("mqtt");
const hostname = "localhost";
const mqtt_port = 1883;
const mongo_port = 27017;

const baseTopic = "vibe/";
// const username = "", shibboleth = "";
// var auth_schema = (username && shibboleth) ? `${username}:${shibboleth}@` : "";
// var mongoURI = `mongodb://${auth_schema}${hostname}:${mongo_port}/database`;
// var mongoPathNoCredentials = `mongodb://${hostname}:${mongo_port}/database`;

// mongoose.connect(mongoURI);

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, "connection error:"));
// db.once('open', function() {
//   console.log(`Connected to Mongo via mongoose on ${mongoPathNoCredentials}`);
// });

// var Venue = require('./models/Venue');
// var Sensor = require('./models/Sensor');
// var Camera = require('./models/Camera');
// var CameraData = require('./models/CameraData');

function setupMQTTListener(mqtt_port, host, topic_path, callback) {
	var client = mqtt.connect({host: host, port: mqtt_port});
	console.log("MQTT client connected on port", mqtt_port);
	client.subscribe(topic_path + "+");
	client.on('message', callback);
	return client;
}

function insertSensorData(topic, payload) {
	var value = parsePayload(payload);
	const key = topic.replace(baseTopic, "");
	const sensorType = getSensorType(key);
	var venueID = value.venueID,
	cameraID = value.cameraID;
	//venueID = Venue.where('ID').equals(venueID).cast();
	switch (sensorType) {
		case SensorType.camera:
			var cameraData = CameraData.create({
				number_of_people: value.numberOfPeople,
				venue_ID: venueID,
				camera_ID: cameraID
			}, insertErrorCallback);
			break;
	}
	return value.numberOfPeople;
}

const SensorType = Object.freeze({
	"camera": 1,
	"ultrasonic": 2,
	"microphone": 3,
});

function getSensorType(key) { // TODO: parse from data
	return SensorType.camera;
}

function parsePayload(payload) {
	logPayload(payload);
	if (payload instanceof String) {
		return JSON.parse(payload)
	}
	return payload;
}

function logPayload(payload) {
	const timestamp = new Date();
	const message = (payload instanceof String) ? payload : JSON.stringify(payload);
	console.log(`[${timestamp}] Received payload "${message}"`);
}

function insertErrorCallback (err, docs) { // will improve
	if (err) {
		console.log("Insert fail");
	}
};

function InstantiateClient(callback) {
	function onMessage(topic, payload) {
		var number = insertSensorData(topic, payload);
		callback(number);
	}
	var mqttClient = setupMQTTListener(mqtt_port, hostname, baseTopic, onMessage);
	return mqttClient;
}

module.exports = InstantiateClient;
