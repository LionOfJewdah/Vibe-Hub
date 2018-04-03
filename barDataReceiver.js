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
	client.subscribe(topic_path + "+");
	client.on('message', callback);
	return client;
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

function InstantiateClient(db, callback) {
	function onMessage(topic, payload) {
		payload = parsePayload(payload)
		var result = db.insertSensorData(topic, payload);
		callback(result);
	}
	var mqttClient = setupMQTTListener(mqtt_port, hostname, baseTopic, onMessage);
	return mqttClient;
}

module.exports = InstantiateClient;
