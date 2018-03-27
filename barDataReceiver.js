// barDataReceiver.js
// Receives data from the raspberry pi over MQTT
// and enters it into the Mongo database

const mongoose = require('mongoose');
const mqtt = require('mqtt');
const hostname = "localhost", collection_name = "pi-mqtt";
const mosquitto_port = 1883, mongo_port = 27017;

//const Mongo = require('mongodb');
//const mongoClient = Mongo.MongoClient;
const username = "", shibboleth = "";
const deviceRoot = "demo/device/";
var auth_schema = (username && shibboleth) ? `${username}:${shibboleth}@` : "";
var mongoURI = `mongodb://${auth_schema}${hostname}:${mongo_port}/database`;

mongoose.connect(mongoURI);

var Venue = require('./models/Venue');
var Sensor = require('./models/Sensor');
var Camera = require('./models/Camera');


var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function() {
  console.log("We're connected to Mongo via mongoose!");
});

var mqttClient;
//var mongoCollection;
//mongoClient.connect(mongoURI, setupMongoCollection);

function setupMongoCollection(err, db) {
	if (err) { throw err; }
	mongoCollection = db.collection(collection_name);
	mqttClient = mqtt.createClient(mosquitto_port, hostname);
	mqttClient.subscribe(deviceRoot + "+");
	mqttClient.on('message', insertEvent);
}
	
function insertEvent(topic, payload) {
	const key = topic.replace(deviceRoot, '');
	var value = parsePayload(payload);
	DBUpdate(key, value, mongoCollection);
}

function DBUpdate(key, value, collection) {
	collection.update(
		{ _id: key }, InsertValue(value),
		{ upsert: true }, InsertErrorCallback
	);
}

function InsertValue(data) {
	return {
		$push: {
			events: {
				event: {
					value: data,
					when: new Date()
				}
			}
		}
	};
}

// will actually parse when payloads become complicated
function parsePayload(payload) {
	return payload;
}

function InsertErrorCallback (err,docs) { // will improve
	if (err) {
		console.log("Insert fail");
	}
};

