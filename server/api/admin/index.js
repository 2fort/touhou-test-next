const router = require('express').Router();

router.use('/characters', require('./characters'));
router.use('/games', require('./games'));

module.exports = router;
