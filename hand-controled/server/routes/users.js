const router = require('express').Router();
const {signUp, signIn, signOut, me} = require('../controllers/users');
const auth = require('../middleware/auth');
const { route } = require('./robots');

// Public routes
router.post("/sign-up", signUp);
router.post("/sign-in", signIn);


// Protected routes
router.post("/sign-out", auth, signOut);

// get current user data
router.get("/me", auth, me);

module.exports = router;
