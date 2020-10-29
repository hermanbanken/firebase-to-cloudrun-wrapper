const functions = require("firebase-functions");

exports.test = functions.region("europe-west1").https.onRequest(async (request, response) => {
	// Automatically parsed body
	var value = request.body.field;
	return response.send({
		value,
		config: functions.config().dummy.config,
	});
});