const router = require('express').Router();

router.use(require('./users'));
router.use(require('./robots'));

module.exports = router;
