const frontend_module = require('./frontEndHandler');
const mqtt_module = require('./barDataReceiver');
const database = require('./database/handle.js');

const mqtt_receiver = mqtt_module(database, (result) => {});
const frontend_server = frontend_module(database);
