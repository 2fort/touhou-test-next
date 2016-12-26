const router = require('express').Router();
const Game = require('../models/game');
const Character = require('../models/character');

router.use('/import', require('./import'));
router.use('/admin', require('./admin'));

router.get('/characters', async (req, res) => {
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
      return Character.find({ _game: game[0]._id }, 'name image slug wiki').exec();
    })
    .then((characters) => {
      return res.json(characters);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

router.get('/game/:game', (req, res) => {
  Game.find({ slug: req.params.game}, 'title').exec()
    .then(game => res.json(game))
    .catch(err => console.log(err));
});

module.exports = router;
