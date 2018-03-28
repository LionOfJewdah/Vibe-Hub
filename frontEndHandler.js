// frontEndHandler.js
// governs API calls from iOS and other front-ends

const Hapi = require("hapi");
const http = require("http");
const fs = require("fs");
const hostname = "localhost";
const host_port = 8000;
const hapi_port = 7000;

const server = new Hapi.Server({
	host: hostname,
	port: hapi_port
});

const json_header = {
	'Content-Type': 'text/json',
	'Access-Control-Allow-Origin': '*',
	'X-Powered-By':'nodejs'
};

const json_template = (function() {
	const json_URI = "./data.json";
	return fs.readFileSync(json_URI);
})();
const payload_template = JSON.parse(json_template);

console.log(`JSON template is:\n${json_template}.`);
var module_handle = {
	currentCount: 4,
	updateCount: (num) => {
		this.currentCount = num;
		console.log(`Updating front end count to ${num}.`);
	}
};

function respondToRequest(request, response) {
	response.writeHead(200, json_header);
	let payload = Object.clone({}, payload_template);
	for (var bar in payload.bars) {
		bar.numberOfPeople = module_handle.currentCount;
	}
	response.write(JSON.stringify(payload));
	response.end();
}

http.createServer(respondToRequest).listen(host_port);
console.log("server initialized");

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

module.exports = module_handle;
