const { resolve } = require("path");

// Replace any require of 'firebase-functions' with our shims
require('require-injector').getInstance({ basedir: __dirname })
  .fromRoot()
  .substitute('firebase-functions', resolve(__dirname, 'cloudrun-shims'));

// Start a replacement server
const app = require("express")();
const { text, json } = require("body-parser");
app.listen(process.env.PORT || "8080");

// This will collect all exports from the functions recursively
// Naming of HTTP paths in Firebase Functions uses the name of the export!
function discoverFunctions(thing, name) {
  const { HttpsFunction } = require("./cloudrun-httpsfunction");
  if (thing instanceof HttpsFunction) {
    console.log(`Serving HTTP ${name}`)
    app.all(name, json(), text(), thing.fn);
    return;
  }
  if (typeof thing === "object") {
    Object.keys(thing).forEach((childName) => discoverFunctions(thing[childName], name + "/" + childName));
  } else {
    console.log(`Ignoring ${name}`)
  }
}
  
// Load the Firebase Functions & configure them via Express
const everything = require("./index");
discoverFunctions(everything, "");

app.get((_req, res) => res.status(404).send("Not Found"));
app.use(require("express").static("public"));
console.log("Started");
process.on('SIGTERM', () => (console.log("stopping"), process.exit(0)));
