const router = require('express').Router();
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });

router.use(requireAuth);

router.use((req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  if (req.user.role === 'spectator') {
    if (req.method === 'GET') {
      return next();
    }

    return res.status(403).end();
  }

  return res.status(500).end();
});

router.use('/characters', require('./characters'));
router.use('/games', require('./games'));

router.get('/testaccess', (req, res) => res.json('OK'));

module.exports = router;
