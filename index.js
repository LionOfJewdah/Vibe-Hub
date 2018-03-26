const Hapi = require('hapi')
const http = require("http");
const fs = require('fs');
const hostname = 'localhost', host_port = 8000;

const server = new Hapi.Server({
	host: hostname,
	port: host_port
})

const json_header = {
	'Content-Type': 'text/json',
	'Access-Control-Allow-Origin': '*',
	'X-Powered-By':'nodejs'
};
const json_template = './data.json';

function respondToRequest(request, response) {
	response.writeHead(200, json_header);
	
    fs.readFile(json_template, function(err, content) {
        response.write(content);
        response.end();
    });
}

http.createServer(respondToRequest).listen(host_port);
console.log("server initialized");

server.route({
	method: 'GET',
	path: '/',
	handler: function (request, reply){
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
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
