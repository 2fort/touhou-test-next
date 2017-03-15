const router = require('express').Router();
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });

router.use(requireAuth);

router.use('/characters', require('./characters'));
router.use('/games', require('./games'));

module.exports = router;
