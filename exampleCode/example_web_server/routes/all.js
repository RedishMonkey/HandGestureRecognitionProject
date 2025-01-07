const express = require('express');
const router = express.Router();
const {getImage, sendImage} = require('../controllers/all')


// Define your routes and associate them with the controller functions
router.post('/send-image', sendImage)
router.get('/get-image', getImage)


module.exports = router;