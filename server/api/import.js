const router = require('express').Router();
const _ = require('lodash');
const Game = require('../models/game');
const Character = require('../models/character');

const games = require('../json/games.json');
const characters = require('../json/characters.json');

const ObjectId = require('mongodb').ObjectId;

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

  Game.find().lean().exec()
    .then(games => {
      characters.forEach(character => {
        games.forEach(game => {
          if (game.title === character.game) {
            character._game = ObjectId(game._id);
          }
        });
        delete character.game;
      });
      return Character.insertMany(characters);
    })
    .then(result => {
      return res.json({ result });
    })
    .catch((err) => {
      return res.json({ err });
    });
});

router.get('/populate/:id', (req, res) => {
  Character.findById(req.params.id).populate('_game', 'title')
    .then((response) => {
      return res.json(response);
    })
    .catch((err) => {
      return res.json(err);
    });
});

module.exports = router;
