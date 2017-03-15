const router = require('express').Router();
const passport = require('passport');
const Game = require('../models/Game');
const Character = require('../models/Character');
const authentication = require('../controller/authentication');

const requireSignin = passport.authenticate('local', { session: false });

router.use('/import', require('./import'));
router.use('/admin', require('./admin'));

router.post('/signup', authentication.signup);
router.post('/signin', requireSignin, authentication.signin);

router.get('/games', async (req, res, next) => {
  try {
    const games = await Game.find({}, 'prefix title year cover slug').sort('order').exec();
    return res.json(games);
  } catch (e) {
    return next(e);
  }
});

router.get('/characters', async (req, res, next) => {
  try {
    const characters = await Character.find({}, 'name image slug').exec();
    return res.json(characters);
  } catch (e) {
    return next(e);
  }
});

router.get('/games/:slug', async (req, res, next) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug }).exec();

    if (!game) {
      return res.status(404).json('Game not found!');
    }

    return res.json(game);
  } catch (e) {
    return next(e);
  }
});

router.get('/games/:slug/characters', async (req, res, next) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug }).exec();

    if (!game) {
      return res.status(404).json('Game not found!');
    }

    const characters = await Character.find({ 'link.rel': game._id }).sort('link.order').exec();
    return res.json(characters);
    // return setTimeout(() => res.json(characters), 3000);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
