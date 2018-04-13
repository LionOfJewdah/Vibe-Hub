// barDataReceiver.js
// Receives semsor data from the raspberry pi over MQTT
// and sends it to be entered into the Mongo database

const mongoose = require("mongoose");
const mqtt = require("mqtt");
const hostname = "localhost";
const mqtt_port = 1883;
const baseTopic = "vibe/";

function setupMQTTListener(mqtt_port, host, topic_path, callback) {
	var client = mqtt.connect({host: host, port: mqtt_port});
	console.log("MQTT client connected on port", mqtt_port);
	client.subscribe(topic_path + "#");
	client.on('message', callback);
	return client;
}

function parsePayload(topic, payload) {
	if (payload instanceof Buffer) {
		payload = JSON.parse(payload.toString());
	}
	payload = Object.assign(payload, getSensorInfo(topic));
	logPayload(payload);
	return payload;
}

function logPayload(update) {
	const timestamp = new Date();
	console.log(`[${timestamp}] received update ${JSON.stringify(update)}`);
}

function InstantiateClient(server, database, routes) {
	function onMessage(topic, payload) {
		payload = parsePayload(topic, payload);
		var result = database.InsertSensorData(payload);
	}
	var mqttClient = setupMQTTListener(mqtt_port, hostname, baseTopic, onMessage);
	server.route(routes(database));
	return mqttClient;
}

function getSensorInfo(topic) {
	var venue, sensor;
	[topic, venue, sensor] = topic.split("/");
	sensor = sensor.split("_");
	var sensorInfo = {
		venueID: parseInt(venue.split("_")[1]),
		sensorType: sensor[0],
		sensorID: parseInt(sensor[1])
	}
	return sensorInfo;
}

module.exports = InstantiateClient;
