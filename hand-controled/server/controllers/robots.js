const z = require("zod");
const {
  linkRobotSchema,
  getUsersLinkReqsSchema,
  acceptLinkReqSchema,
  getUsersRobotsSchema,
  denyLinkReqSchema,
} = require("../lib/validation/robots");
const {
  userExists,
  addRobotLinkReq,
  getUsersLinkReqs: getUsersLinkReqsFromDB,
  getUsersRobots: getUsersRobotsFromDB,
  deleteLinkReq,
  addRobot,
} = require("../lib/firebaseUtils");

const robotLinkReq = async (req, res) => {
  try {
    const { macAddress, usersUsername } = linkRobotSchema.parse(req.body);

    await addRobotLinkReq(usersUsername, macAddress);

    return res.status(200).json({ message: "Robot linked successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues[0].message);
    } else {
      console.log(error);
    }

    return res.status(400).json({ message: "Invalid request" });
  }
};

const getUsersLinkReqs = async (req, res) => {
  try {
    const { username } = getUsersLinkReqsSchema.parse(req.body);
  
    const usersLinkReqs = await getUsersLinkReqsFromDB(username);

    return res.status(200).json({ usersLinkReqs });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues[0].message);
    } else {
      console.log(error);
    }

    return res
      .status(400)
      .json({ message: "error getting users link requests" });
  }
};

const acceptLinkReq = async (req, res) => {
  try {
    const { username, macAddress } = acceptLinkReqSchema.parse(req.body);
    const user = await userExists(username);

    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }

    const linkReq = await getUsersLinkReqsFromDB(username);

    if (!linkReq) {
      return res.status(400).json({ message: "link request does not exist" });
    }

    if (!linkReq.includes(macAddress)) {
      return res.status(400).json({ message: "link request does not exist" });
    }


    await deleteLinkReq(username, macAddress);
    await addRobot(username, macAddress);
    

    return res.status(200).json({ message: "link request accepted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues[0].message);
    } else {
      console.log(error);
    }

    return res.status(400).json({ message: "error accepting link request" });
  }
};

const denyLinkReq = async (req, res) => {
  try {
    const { username, macAddress } = denyLinkReqSchema.parse(req.body);
    await deleteLinkReq(username, macAddress);
    
    return res.status(200).json({ message: "link request denied successfully" });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues[0].message);
    } else {
      console.log(error);
    }

    return res.status(400).json({ message: "error denying link request" });
  }
};

const getUsersRobots = async (req, res) => {
  try {
    const { username } = getUsersRobotsSchema.parse(req.body);

    const usersRobots = await getUsersRobotsFromDB(username);

    const robotsArray = Object.keys(usersRobots);
    const robots = robotsArray.map((robot) => {
      return {
        nickname: usersRobots[robot].nickname,
        macAddress: robot,
        state: usersRobots[robot].state,
      };
    });

    return res.status(200).json({ robots });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.issues[0].message);
    } else {
      console.log(error);
    }

    return res.status(400).json({ message: "error getting users robots" });
  }
};

module.exports = {
  robotLinkReq,
  getUsersLinkReqs,
  getUsersRobots,
  acceptLinkReq,
  denyLinkReq,
};
