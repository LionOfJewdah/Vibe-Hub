'use strict';

const Hapi = require("hapi");
const Config = require("./config/config");

const server = Hapi.Server(Config.server);

const init = async () => {
	await server.register({
		plugin: require('hapi-pino'),
		options: {
			prettyPrint: true,
			logEvents: ['response']
		}
	});
	await server.start();
	console.log(`Hapi server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

/*
server.events.on('route', (route) => {
    console.log(`New route added: ${route.path}`);
});
*/

init();

module.exports = server;
