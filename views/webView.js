// webView.js
// Shows us what database.GetVenuesAndBestVibes() returns
// 100% there's a better way to do this but #YOLO
// After all, YOLO is the core of our business logic.

module.exports = (database) => {
	return async function WebView(request, reply) {
		try {
			const { bars, bestVibes } = await database.GetVenuesAndBestVibes();
			let payload = '<html><title="Vibe: Venues and Vibes"/><body>'
			+ "<h1>Venues:</h1>\n" + "<table>\n"
			+ "<tr><th>Venue</th><th>image</th><th>location</th>"
			+ "<th>venue ID</th><th>Capacity</th><th>Number of people</th>"
			+ "<th>Percent capacity</th></tr>\n"
			bars.forEach((bar) => {
				payload += '<tr>' + makeTD(bar.name) + makeTD(bar.img)
					+ makeTD(bar.location) + makeTD(bar.venue_ID)
					+ makeTD(bar.capacity) + makeTD(bar.numberOfPeople) 
					+ makeTD(percentCap(bar) + '%') + '</tr>\n'
			});
			payload += '</table>\n' + '<h1>Vibes:</h1>\n'+ "<table>\n"
						+ '<tr><th>Venue</th><th>Image</th></tr>\n'
			bestVibes.forEach((vibe) => {
				payload += '<tr>' + makeTD(vibe.name) + makeTD(vibe.img)
							+ '</tr>\n'
			})
			payload += '</table>\n' + '</body>' + '</html>';
			return payload;
		} catch (err) {
			return {error: 'problem loading venues and best vibes web view.'};
		}
	}
}

function makeTD(val) {
	return `<td>${val}</td>`;
}

function percentCap(bar) {
	return Math.round(bar.numberOfPeople/bar.capacity*100);
}
