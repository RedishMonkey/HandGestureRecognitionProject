const admin = require("firebase-admin");
const path = require("path");
const serviceAccount = require(path.join(__dirname, "../firebase_key.json"));

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  // The database URL depends on the location of the database
  databaseURL:
    "https://hand-recognition-a7ca9-default-rtdb.europe-west1.firebasedatabase.app/",
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();

// Reference the specific path where the data is stored
const ref = db.ref("/");

const getRef = (path) => {
  return db.ref(path);
};

const usersRef = getRef("users");

// Function to get all user branches
const getAllUsers = async () => {
  try {
    const snapshot = await usersRef.once("value");
    const users = snapshot.val();
    return users;
  } catch (error) {
    console.error("Error fetching user branches:", error);
    throw error;
  }
};
const addUser = async (username, email, password) => {
  const userRef = usersRef.child(username);
  await userRef.set({ email, password });
  console.log("User added successfully");
};

const getUser = async (username) => {
  console.log("getting user");
  const userRef = usersRef.child(username);

  const userData = (await userRef.once("value")).val();
  if (!userData) {
    return null;
  }


  const user = {
    username: username,
    email: userData.email,
    password: userData.password,
  };

  return user;
};


// Function to cleanup Firebase connection - call this when shutting down your application
const cleanup = async () => {
  try {
    await admin.app().delete();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database connection:", error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  addUser,
  getUser,
};
