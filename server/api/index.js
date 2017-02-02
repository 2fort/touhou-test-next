const router = require('express').Router();
const Game = require('../models/game');
const Character = require('../models/character');

router.use('/import', require('./import'));
router.use('/admin', require('./admin'));

router.get('/games', async (req, res, next) => {
  try {
    const games = await Game.find({}, 'prefix title year cover slug').exec();
    return res.json(games);
    // return setTimeout(() => res.json(games), 5000);
  } catch (e) {
    return next(e);
  }
});

router.get('/characters/:game', (req, res, next) => {
  Game.find({ slug: req.params.game }).lean().exec()
    .then((game) => {
      if (!game[0]) {
        throw new Error('404'); // game not found!
      }

      return Character.find({ _game: game[0]._id }, 'name image slug wiki _game').populate('_game', 'title slug').exec();
    })
    .then(characters => res.json(characters))  // setTimeout(() => res.json(characters), 1000);
    .catch(e => next(e));
});

router.get('/character/:char', async (req, res, next) => {
  try {
    let charInfo = await Character.find({ slug: req.params.char }).populate('_game').exec();

    if (!charInfo[0]) {
      throw new Error('404'); // character not found!
    }

    charInfo = charInfo[0].toObject();
    const allCharsFromGame = await Character.find({ _game: charInfo._game.id }, '_id slug').lean().exec();

    allCharsFromGame.forEach((charId, i) => {
      if (charId._id.toString() === charInfo.id.toString()) {
        charInfo.prevCharacter = (i !== 0) ? allCharsFromGame[i - 1].slug : '';
        charInfo.nextCharacter = (i !== allCharsFromGame.length - 1) ? allCharsFromGame[i + 1].slug : '';
      }
    });

    return res.json([charInfo]);
  } catch (e) {
    return next(e);
  }
});

router.get('/characters', (req, res, next) => {
  Character.find({}, 'name image slug').exec()
    .then(characters => res.json(characters))
    .catch(e => next(e));
});

module.exports = router;
