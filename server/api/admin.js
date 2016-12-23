const router = require('express').Router();

const Game = require('../models/game');
const Character = require('../models/character');

router.get('/games', (req, res) => {
  Game.find().exec()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      return res.json(err);
    });
});

router.get('/characters', (req, res) => {
  Character.find().exec()
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      return res.json(err);
    });
});

module.exports = router;