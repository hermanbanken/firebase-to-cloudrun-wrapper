const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

db.collection('blogs').doc("1").set({title:'My Blog', text: 'A story'}, {merge: true});

exports.form = require("./form");

exports.settings = functions.region("europe-west1").https.onRequest(async (_request, response) => {
	return response.send({
		version: 1,
		platform: process.platform,
		port: process.env.PORT,
		config: functions.config().dummy.config,
	});
});

exports.blog = functions.region("europe-west1").https.onRequest(async (_request, response) => {
	return response.send(db.collection('blogs').get());
});
