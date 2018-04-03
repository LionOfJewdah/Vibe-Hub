
server.route({
	method: 'GET',
	path: '/api/venue/{venue_name}',
	handler: function (request, reply) {
		const requested_name = request.replace(serverAddr + "/api/venue/", "");
		const query = request.query.split("&").map(/*however you turn ?stuff=thing&key=val to 
		{
			stuff: thing,
			key: val
		}*/)
		var bar_info = Mongo.select(query.fields).from("Venues")
			.where('name').equals(requested_name);
		return JSON.stringify(bar_info);
	}
})

server.route({
	method: 'GET',
	path: '/api/venue/{venue_name}',
	handler: function (request, reply) {
		const requested_name = request.replace(serverAddr + "/api/venue/", "");
		const query = request.query.split("&").map(/*however you turn ?stuff=thing&key=val to 
		{
			stuff: thing,
			key: val
		}*/)
		var bar_info = Mongo.select(query.fields).from("Venues")
			.where('name').equals(requested_name);
		return JSON.stringify(bar_info);
	}
})
