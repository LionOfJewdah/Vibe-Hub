var Hapi = require('hapi')

var server = new Hapi.Server({
	host: 'localhost',
	port: '8000'
})

var http = require("http");
var fs 		= require('fs');

http.createServer(function(request, response) {
 
    response.writeHead(200, {
        'Content-Type': 'text/json',
		'Access-Control-Allow-Origin': '*',
		'X-Powered-By':'nodejs'
    });


    fs.readFile('data.json', function(err, content){
        response.write(content);
        response.end();
    });

}).listen(8000);
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
	handler: function (request, reply){
		return 'Hello, ' + request.params.name;
	}
})

server.route({
	method: 'GET',
	path: '/api/{search}',
	handler: function (request, reply) {
		return 'You searched for ' + request.params.search
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

