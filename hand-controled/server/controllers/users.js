const {
  signUpSchema,
  signInSchema,
  setProfileImgSchema,
  removeRobotSchema,
  setRobotNicknameSchema,
  setRobotStateSchema,
  getRobotStateSchema,
} = require("../lib/validation/users");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const {
  userExists,
  addUser,
  getUser,
  setUsersProfileImg,
  getUsersProfileImg,
  removeUsersRobot,
  setUserRobotNickname,
  setUserRobotState,
  getUserRobotState,
} = require("../lib/firebaseUtils");
const { setTokenCookie } = require("../lib/validation/coockies");

const signUp = async (req, res) => {
  try {
    const { username, email, password } = signUpSchema.parse(req.body);

    const usernameExists = await userExists(username);

    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await addUser(username, email, hashedPassword);

    setTokenCookie(
      res,
      username,
      hashedPassword,
      email,
      process.env.JWT_SECRET
    );

    return res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = signInSchema.parse(req.body);

    const user = await getUser(username);
    // return res.status(200).json({message:user?user:"null"});
    if (!user) {
      return res.status(400).json({ message: "invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "invalid username or password" });
    }
    setTokenCookie(
      res,
      username,
      user.password,
      user.email,
      process.env.JWT_SECRET
    );
    return res.status(200).json({ message: "Login successfully" });
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const me = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const setProfileImg = async (req, res) => {
  try {
    const { profileImg } = setProfileImgSchema.parse(req.body);
    const user = req.user;

    await setUsersProfileImg(user.username, profileImg);

    return res.status(200).json({ message: "Profile image set successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors[0].message);
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProfileImg = async (req, res) => {
  try {
    const user = req.user;

    const profileImg = await getUsersProfileImg(user.username);

    return res.status(200).json({ profileImg });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const removeRobot = async (req, res) => {
  try {
    const { macAddress } = removeRobotSchema.parse(req.body);
    const user = req.user;

    await removeUsersRobot(user.username, macAddress);

    return res.status(200).json({ message: "Robot removed successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors[0].message);
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const setRobotNickname = async (req, res) => {
  try {
    const { macAddress, nickname } = setRobotNicknameSchema.parse(req.body);
    const user = req.user;

    await setUserRobotNickname(user.username, macAddress, nickname);

    return res.status(200).json({ message: "Robot nickname set successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors[0].message);
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const setRobotState = async (req, res) => {
  try {
    const { macAddress, state } = setRobotStateSchema.parse(req.body);
    const user = req.user;

    await setUserRobotState(user.username, macAddress, state);

    return res.status(200).json({ message: "Robot state set successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors[0].message);
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }

}

const getRobotState = async (req, res) => {
  try {
    const { macAddress } = getRobotStateSchema.parse(req.body);
    const user = req.user;

    const state = await getUserRobotState(user.username, macAddress);

    return res.status(200).json({ state });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors[0].message);
      return res.status(400).json({ message: error.errors[0].message });
    }

    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
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
};
