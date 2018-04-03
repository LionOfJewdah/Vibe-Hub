// frontEndHandler.js
// governs API calls from iOS and other front-ends

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

function GetAllTheData(request, reply) {
	return json_template;
}

server.route([{
	method: 'GET',
	path: '/vibe',
	handler: GetAllTheData
}, {
	method: 'GET',
	path: '/api/vibe',
	handler: GetAllTheData
}])

function QueryBarsAndBest (request, reply) { 
	//var bars = database.GetBarData();
	//var bestVibes = database.GetBestVibes();
	return JSON.stringify({
		bars: module_handle.bars,
		bestVibes: module_handle.bestVibes
	});
}

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

//module.exports = module_handle;
