const router = require('express').Router();
const Game = require('../models/game');
const Character = require('../models/character');

router.use('/import', require('./import'));
router.use('/admin', require('./admin'));

router.get('/games', async (req, res) => {
  try {
    const games = await Game.find({}, 'prefix title year cover slug').exec();
    return res.json(games);
  } catch (e) {
    return res.json({ message: e.message });
  }
});

router.get('/characters/:game', (req, res) => {
  Game.find({ slug: req.params.game }).lean().exec()
    .then((game) => {
      return Character.find({ _game: game[0]._id }, 'name image slug wiki _game').populate('_game', 'title slug').exec();
    })
    .then((characters) => {
      return res.json(characters);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

router.get('/character/:char', (req, res) => {
  Character.find({ slug: req.params.char }).populate('_game').exec()
    .then((character) => {
      console.log(character);
      return res.json(character);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

router.get('/characters', (req, res) => {
  Character.find({}, 'name image').lean().exec()
    .then(characters => res.json(characters))
    .catch(err => res.status(404).json(err.message));
});

router.get('/exp', (req, res) => {
  Character.find().skip(0).limit(10).exec()
    .then(games => res.json(games))
    .catch(err => console.log(err));
});

module.exports = router;
