const { signUpSchema, signInSchema } = require("../lib/validation/users");
const { z } = require("zod");
const bcrypt = require("bcrypt");
const { userExists } = require("../lib/users");
const { addUser, getUser } = require("../lib/firebaseUtils");
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

    setTokenCookie(res, username, hashedPassword, email, process.env.JWT_SECRET);

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
    setTokenCookie(res, username, user.password, user.email, process.env.JWT_SECRET);
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

module.exports = {
  signUp,
  signIn,
  signOut,
  me,
};
