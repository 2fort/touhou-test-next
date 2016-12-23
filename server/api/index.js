const router = require('express').Router();
const Game = require('../models/game');

router.get('/hello',  (req, res) => {
  res.json({ message: 'hello'});
});

router.use('/import', require('./import'));
router.use('/admin', require('./admin'));

router.get('/characters', async (req, res) => {
  try {
    const result = await Game.find().exec();
    const send = result.map(game => ({
      prefix: game.prefix,
      title: game.title,
      year: game.year,
      cover: game.cover,
    }));
    return res.json(send);
  } catch (e) {
    return res.json({ message: 'wtf' });
  }
});

/* router.get('/characters/:game', async (req, res) => {
  const game = req.params.game;
  res.json({ game: game });
});*/


module.exports = router;
