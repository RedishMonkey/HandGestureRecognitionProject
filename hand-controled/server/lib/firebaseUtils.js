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
const usersRef = ref.child("users");
const robotsLinkReqsRef = ref.child("robotsLinkReqs");

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
  try {
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
  } catch (error) {
    return error;
  }
};

const userExists = async (username) => {
  try {
    const user = await getUser(username);

    if (!user) return false;
    return true;
  } catch (error) {
    console.log("Error checking user existence:", error);
    throw error;
  }
};

const isMacAddInLinkReqs = async (macAddress) => {
  const snapshot = await robotsLinkReqsRef.once("value");
  const data = snapshot.val() || {};

  const values = Object.values(data);
  const exists = values.some((value) => value.includes(macAddress));

  return exists;
};

const addRobotLinkReq = async (username, macAddress) => {
  // checking if the robot is already trying to connect
  const isMacInLinkReqs = await isMacAddInLinkReqs(macAddress);
  if (isMacInLinkReqs) {
    console.log("MAC address already exists in the list");
    return;
  }
  const isUserExists = await userExists(username);
  if (!isUserExists) {
    console.log("Username does not exist");
    return;
  }

  try {
    const robotLinkReqRef = robotsLinkReqsRef.child(username);

    // the transaction function tries to write to the database and if its interupted by another write
    // it starts again with the new value
    await robotLinkReqRef.transaction((currentData) => {
      console.log("currentData: ", currentData);
      if (currentData === null) return [macAddress];
      if (!currentData.includes(macAddress))
        return [...currentData, macAddress];

      return currentData;
    });

    console.log("Robot link request added successfully");
  } catch (error) {
    console.error("Error adding robot link request:", error);
    throw error;
  }
};


const getUsersLinkReqs = async (username) => {
  try {
    const isUserExists = await userExists(username);
    if (!isUserExists) {
      throw new Error("Username does not exist");
    }

    const robotLinkReqRef = robotsLinkReqsRef.child(username);
    const snapshot = await robotLinkReqRef.once("value");
    const data = snapshot.val();

    return data;
  } catch (error) {
    console.log("Error fetching users link requests:", error);
    throw error;
  }
};

const deleteLinkReq = async (username, macAddress) => {
  try {
    const isUserExists = await userExists(username);
    if (!isUserExists) {
      throw new Error("Username does not exist");
    }

    const robotLinkReqRef = robotsLinkReqsRef.child(username);
    const data = (await robotLinkReqRef.once("value")).val();

    if (!data) throw new Error("No link requests found");

    const macAddresses = Object.values(data);
    const index = macAddresses.indexOf(macAddress);
   
    if (index === -1) throw new Error("MAC address does not exist in the list");

    await robotLinkReqRef.transaction((currentData)=>{

      if (currentData === null) return null;
      const index = currentData.indexOf(macAddress);
      
      if (index !== -1) {
        currentData.splice(index, 1);
        return currentData;
      }

      return currentData;
    })

      
  } catch (error) {
    console.log("Error deleting link request:", error);
  }
};


const getUsersRobots = async (username) => {
  try {
    const isUserExists = await userExists(username);
    
    if (!isUserExists) {
      throw new Error("Username does not exist");
    }

    const robotsRef = usersRef.child(username).child("robots");
    const snapshot = await robotsRef.once("value");
    const data = snapshot.val();
    return data;
  } catch (error) {
    return error;
  }
};

const addRobot = async (username, macAddress) => {
  try {
    const isUserExists = await userExists(username);
    if (!isUserExists) {
      throw new Error("Username does not exist");
    }

    const robotRef = usersRef.child(username).child("robots");
    
    // checks if robot already exists
    const usersRobots = (await robotRef.once("value")).val();
    const robotMacAdds = Object.keys(usersRobots);
    if (robotMacAdds.includes(macAddress)) throw new Error("Robot already exists");


    let dataToAdd = {[macAddress]: {state: "none", nickname: "none"}}

    await robotRef.transaction((currentData)=>{
      if (!currentData) return dataToAdd;
      
      const robotMacAdds = Object.keys(currentData);

      currentData[macAddress] = {state: "none", nickname: "none"}
      return currentData;
    });
  } catch (error) {
    console.log("error: ", error);
    throw error;
  }
};


// Function to cleanup Firebase connection - call this when shutting down your application
const cleanup = async () => {
  try {
    await admin.app().delete();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database connection:", error);
    return error;
  }
};

module.exports = {
  getAllUsers,
  addUser,
  getUser,
  addRobotLinkReq,
  userExists,
  getUsersLinkReqs,
  deleteLinkReq,
  addRobot,
  getUsersRobots,
};
