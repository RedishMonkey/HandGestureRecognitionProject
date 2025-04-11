const router = require('express').Router();
const { robotLinkReq, getUsersLinkReqs, getUsersRobots, acceptLinkReq, denyLinkReq } = require('../controllers/robots');
const auth = require("../middleware/auth")

// adding a request to link to a user
router.post("/robot-link-req", auth, robotLinkReq);

// getting all the requests to link to a user
router.post("/get-users-link-reqs", auth, getUsersLinkReqs);

// getting all the robots of a user
router.post("/get-users-robots", auth, getUsersRobots);

// accepting a link request
router.post("/accept-link-req", auth, acceptLinkReq);

// denying a link request
router.post("/deny-link-req", auth, denyLinkReq);

// deleting a request to link to a user
// router.post("/delete-robot-link-req", auth, deleteRobotLinkReq);

module.exports = router;


