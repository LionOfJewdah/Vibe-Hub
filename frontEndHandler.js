// frontEndHandler.js
// governs API calls from iOS and other front-ends

function frontEndHandler(database) {
	this.database = database;
	const Hapi = require("hapi");
	const fs = require("fs");
	const hostname = "localhost";
	const hapi_port = 8000;

	const server = new Hapi.Server({
		host: hostname,
		port: hapi_port
	});

	const response_headers = {
		json: {
			'Content-Type': 'text/json',
			'Access-Control-Allow-Origin': '*',
			'X-Powered-By':'nodejs'
		}
	};

	const json_template = (function() {
		const json_URI = "./data.json";
		return fs.readFileSync(json_URI);
	})();
	const payload_template = JSON.parse(json_template);


	server.route({
		method: 'GET',
		path: '/',
		handler: function (request, reply) {
			return 'Hello';
		}
	})


	server.route({
		method: 'GET',
		path: '/{name}',
		handler: function (request, reply) {
			return `Hello, ${request.params.name}.`;
		}
	})

	server.route({
		method: 'GET',
		path: '/api/{search}',
		handler: function (request, reply) {
			return `You searched for ${request.params.search}.`;
		}
	})

	server.route({
		method: 'GET',
		path: '/api/test',
		handler: function (request, reply) {
			return {
				a: 1,
				b: 2
			}
		}
	})

	function GetVenues(request, reply) {
		return database.GetVenues(lim=10);
	}

	function GetBestVibes(request, reply) {
		return database.GetBestVibes(lim=5);
	}

	function GetVenuesAndBestVibes(request, reply) {
		console.log("GetVenues() returns: ", JSON.stringify(GetVenues()));
		return database.GetVenuesAndBestVibes();
	}

	server.route([{
		method: 'GET',
		path: '/vibe',
		handler: GetVenuesAndBestVibes
	}, {
		method: 'GET',
		path: '/api/vibe',
		handler: GetVenuesAndBestVibes
	}])

	server.route({
		method: 'GET',
		path: '/api/venues',
		handler: GetVenues
	})

	server.route({
		method: 'GET',
		path: '/api/bestVibes',
		handler: GetBestVibes
	})

	const init = async () => {
		await server.register({
			plugin: require('hapi-pino'),
			options: {
				prettyPrint: false,
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

	init();
}

module.exports = frontEndHandler;

