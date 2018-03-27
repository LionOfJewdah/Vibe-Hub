// barDataReceiver.js
// Receives data from the raspberry pi over MQTT
// and enters it into the Mongo database

const mongoose = require("mongoose");
const mqtt = require("mqtt");
const hostname = "localhost";
const mosquitto_port = 1883;
const mongo_port = 27017;

const username = "", shibboleth = "";
const topicPath = "demo/device/";
var auth_schema = (username && shibboleth) ? `${username}:${shibboleth}@` : "";
var mongoURI = `mongodb://${auth_schema}${hostname}:${mongo_port}/database`;

mongoose.connect(mongoURI);

var Venue = require('./models/Venue');
var Sensor = require('./models/Sensor');
var Camera = require('./models/Camera');
var CameraData = require('./models/CameraData');

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function() {
  console.log("We're connected to Mongo via mongoose!");
});

function setupMQTTListener(mqtt_port, host, topic_path, callback) {
	var client = mqtt.connect({host: host, port: mqtt_port});
	console.log("MQTT client connected on port", mqtt_port);
	client.subscribe(topic_path + "+");
	client.on('message', callback);
	return client;
}

var mqttClient = setupMQTTListener(mosquitto_port, hostname, topicPath, insertQueryData);

function insertQueryData(topic, payload) {
	const key = topic.replace(topicPath, "");
	const sensorType = getSensorType(key);
	var value = parsePayload(payload);
	const venueID = value.venueID, cameraID = value.cameraID;
	const venue = Venue.where('ID').equals(venueID).cast();
	switch (sensorType) {
		case SensorType.camera:
			var cameraData = CameraData.create({
				number_of_people: value.numberOfPeople,
				venue: venue,
				camera_ID: cameraID
			}, insertErrorCallback);
			break;
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

// will actually parse when payloads become complicated
function parsePayload(payload) {
	return payload;
}

function insertErrorCallback (err, docs) { // will improve
	if (err) {
		console.log("Insert fail");
	}
};
