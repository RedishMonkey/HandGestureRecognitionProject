const router = require("express").Router();
const {
  signUp,
  signIn,
  signOut,
  me,
  setProfileImg,
  getProfileImg,
  removeRobot,
  setRobotNickname,
  setRobotState,
  getRobotState,
} = require("../controllers/users");
const auth = require("../middleware/auth");
// Public routes
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

// Protected routes
router.post("/sign-out", auth, signOut);

// get current user data
router.get("/me", auth, me);

// set profile image
router.post("/set-profile-img", auth, setProfileImg);

// get profile image
router.get("/get-profile-img", auth, getProfileImg);

// remove robot
router.post("/remove-robot", auth, removeRobot);

// set robot nickname
router.post("/set-robot-nickname", auth, setRobotNickname);

// set robot state
router.post("/set-robot-state", auth, setRobotState);

// get robot state
router.post("/get-robot-state", auth, getRobotState);

module.exports = router;
