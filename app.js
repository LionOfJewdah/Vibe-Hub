const server = require('./server');
const frontend_module = require('./frontEndHandler');
const mqtt_module = require('./barDataReceiver');
const database = require('./database/handle.js');
const frontEndRoutes = require('./routes/frontEnd'),
	backEndRoutes = require('./routes/backEnd');

const mqtt_receiver = mqtt_module(database, backEndRoutes);
const frontend_server = frontend_module(server, database, frontEndRoutes);
