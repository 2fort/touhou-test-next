const router = require('express').Router();
const Game = require('../models/game');
const Character = require('../models/character');

router.use('/import', require('./import'));
router.use('/admin', require('./admin'));

router.get('/games', async (req, res) => {
  try {
    const games = await Game.find({}, 'prefix title year cover slug').exec();
    return res.json(games);
    // return setTimeout(() => res.json(games), 5000);
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
      // return setTimeout(() => res.json(characters), 1000);
      return res.json(characters);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

router.get('/character/:char', (req, res) => {
  let character = {};

  Character.find({ slug: req.params.char }).populate('_game').exec()
    .then((response) => {
      if (!response[0]) {
        return Promise.reject(Error('404!'));
      }

      character = response[0].toObject();

      return Promise.all([
        Character.find({ _id: { $lt: character.id } }).sort({ _id: -1 }).limit(1).lean().exec(),
        Character.find({ _id: { $gt: character.id } }).sort({ _id: 1 }).limit(1).lean().exec(),
      ]);
    })
    .then((response) => {
      const prevCharInfo = response[0][0];
      const nextCharInfo = response[1][0];

      // blank array === true, but blank array[0] === undefined
      if (prevCharInfo && character._game.id === prevCharInfo._game.toString()) {
        character.prevCharacter = prevCharInfo.slug;
      }

      if (nextCharInfo && character._game.id === nextCharInfo._game.toString()) {
        character.nextCharacter = nextCharInfo.slug;
      }

      return res.json([character]);
    })
    .catch((err) => {
      return res.status(404).json(err.message);
    });
});

router.get('/charinfo/:char', async (req, res) => {
  try {
    const charInfo = (await Character.find({ slug: req.params.char })
      .populate('_game')
      .exec())[0]
      .toObject();

    const allCharsFromGame = await Character.find({ _game: charInfo._game.id }, '_id slug').lean().exec();

    allCharsFromGame.forEach((charId, i) => {
      if (charId._id.toString() === charInfo.id.toString()) {
        charInfo.prevCharacter = (i !== 0) ? allCharsFromGame[i - 1].slug : '';
        charInfo.nextCharacter = (i !== allCharsFromGame.length - 1) ? allCharsFromGame[i + 1].slug : '';
      }
    });

    return res.json([charInfo]);
  } catch (e) {
    return res.json(e.message);
  }
});

router.get('/characters', (req, res) => {
  Character.find({}, 'name image slug').exec()
    .then(characters => res.json(characters))
    .catch(err => res.status(404).json(err.message));
});

router.get('/exp', (req, res) => {
  Character.find().skip(0).limit(10).exec()
    .then(games => res.json(games))
    .catch(err => console.log(err));
});

module.exports = router;
