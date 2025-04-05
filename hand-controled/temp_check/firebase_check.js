const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = require(path.join(__dirname, 'firebase_key.json'));

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  // The database URL depends on the location of the database
  databaseURL: "https://hand-recognition-a7ca9-default-rtdb.europe-west1.firebasedatabase.app/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();

// Reference the specific path where the data is stored
var ref = db.ref("/");

// ref.once() reads the data at the specified reference path once
// "value" event type returns all data at the location
// The callback function receives a snapshot containing the data
// snapshot.val() returns the data as a JavaScript object
ref.once("value", function(snapshot) {
  // Get the value at this location
  const value = snapshot.val();
  console.log("The value is:", snapshot.val());
  
  // Close the database connection and terminate the app
  admin.app().delete().then(() => {
    console.log("Database connection closed");
  });
});