// barDataReceiver.js
// Receives data from the raspberry pi over MQTT
// and enters it into the Mongo database

const Mongo = require("mongodb");
const mqtt = require('mqtt');
const hostname = 'localhost', mosquitto_port = 1883, mongo_port = 27017;
const collection_name = "pi-mqtt";

const mongoClient=Mongo.MongoClient;
var mongoURI = `mongodb://${hostname}:${mongo_port}/database`;
//`mongodb://username:password@localhost:${mongo_port}/database`
var deviceRoot="demo/device/"
var mongoCollection, mqttClient;
mongoClient.connect(mongoURI, setupMongoCollection);

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

