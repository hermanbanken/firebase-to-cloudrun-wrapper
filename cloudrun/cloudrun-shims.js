/*
 * The shims: this is where the 'magic' happens.
 *
 * config: via Environment
 * https: via express
 * auth: via ? (TODO)
 * firestore: via https://cloud.google.com/firestore/docs/query-data/listen (TODO)
 */

/**
 * region(_) will return a nested object that can be used to register regular HTTP handlers
 * @param {*} _region not used; control this with the Cloud Run deployment
 */
exports.region = function region(_region) {
	return {
		https: {
			onRequest(fnHandler) {
                const { HttpsFunction } = require("./cloudrun-httpsfunction");
				return new HttpsFunction(fnHandler);
			}
        },
        auth: {
            user() {
                return {
                    onCreate(fn) {
                        console.log("Not handling auth.user().onCreate in this Cloud Run instance! Deploy to Firebase Hosting to use/test that one.");
                    }
                }
            }
        }
    };
}

/**
 * config() will convert process.env into an object. Example:
 * 
 * TEST_NESTED_KEY=FOOBAR1
 * TEST_NESTED_OTHER=FOOBAR2
 *
 * is converted to
 *
 * {
 *   "TEST": {
 *     "NESTED": {
 *       "KEY": "FOOBAR1",
 *       "OTHER": "FOOBAR2",
 *     }
 *   }
 * }
 */
exports.config = function config() {
    const result = {};
    for(const key of Object.keys(process.env).filter((key) => key !== "_")) {
        const value = process.env[key];
        let root = result;
        const parts = key.split("_");
        for (let i = 0; i < parts.length; i++) {
            if (i == parts.length - 1) {
                root[parts[i]] = value;
            } else {
                if (typeof root[parts[i]] !== "object") {
                    root[parts[i]] = {};
                }
                root = root[parts[i]];
            }
        }
    }
    return result;
}

/*
https://cloud.google.com/firestore/docs/query-data/listen
db.collection("cities").where("state", "==", "CA")
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            if (change.type === "added") {
                console.log("New city: ", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });
    });*/
