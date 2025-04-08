const jwt = require("jsonwebtoken");
const { getUser } = require("../lib/firebaseUtils");

const auth = async (req, res, next) => {
  try {
    console.log("Starting authentication process...");
    
    // get token from cookies
    const token = req.cookies?.token;
    console.log("Token from cookies:", token ? "exists" : "not found");
    
    // check if token exists
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // check if token expired
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: "Unauthorized" });
    }


    
    // check if  token is valid
    const user = await getUser(decoded.username);

    if(decoded.password !== user.password) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = {
      username: decoded.username,
      password: decoded.password,
      email: decoded.email,
      exp: decoded.exp,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = auth;
