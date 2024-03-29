#!/usr/bin/env node
'use strict';
const Hapi = require('hapi');
const Config = require('./config');

const server = Hapi.Server(Config.server);

const init = async () => {
	/*await server.register({
		plugin: require('hapi-pino'),
		options: {
			prettyPrint: false,
			logEvents: ['request-error']
		}
	});*/
	await server.start();
	console.log(`Hapi server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
});

init();
module.exports = server;
