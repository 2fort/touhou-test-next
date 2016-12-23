const router = require('express').Router();
const _ = require('lodash');
const Game = require('../models/game');
const Character = require('../models/character');

const games = require('../../client/src/json/games.json');
const characters = require('../../client/src/json/characters.json');

router.get('/games', (req, res) => {
  games.forEach(game => {
    game.slug = _.snakeCase(game.title);
  });

  Game.insertMany(games)
    .then(result => {
      return res.json({ result });
    })
    .catch(err => {
      return res.json({ err });
    });
});

router.get('/characters', (req, res) => {
  characters.forEach(character => {
    character.slug = _.snakeCase(character.name);
  });

  Character.insertMany(characters)
    .then(result => {
      return res.json({ result });
    })
    .catch(err => {
      return res.json({ err });
    });
});

module.exports = router;
