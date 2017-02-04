const router = require('express').Router();
const _ = require('lodash');
const Game = require('../models/game');
const Character = require('../models/character');

const utils = require('../lib/utils');
const games = require('../json/games.json');
const characters = require('../json/characters.json');
const config = require('../config');

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

router.get('/exp/reorder', async (req, res, next) => {
  try {
    const allGames = await Game.find().exec();
    allGames.forEach((game, i) => {
      allGames[i] = game.toObject();
      allGames[i].order = i + 1;
    });

    const updateGames = allGames.map(game => Game.findByIdAndUpdate(game.id, game));
    const result = await Promise.all(updateGames);

    return res.json(result);
  } catch (e) {
    return next(e);
  }
});

router.get('/exp/purgecovers', (req, res) => {
  Game.find().exec()
    .then((gamesRes) => {
      const filesInDb = gamesRes.map(game => Game.findByIdAndUpdate(game._id, { cover: '' }));

      const filesInFs = [];
      gamesRes.forEach((game) => {
        if (game.cover) {
          filesInFs.push(config.IMG_ORIG + game.cover);
          filesInFs.push(config.IMG_COMPRESSED + game.cover);
          filesInFs.push(config.IMG_THUMBNAIL + game.cover);
        }
      });

      const deleteFilesInFs = utils.deleteMany(filesInFs);
      const deleteAllFilesRecords = filesInDb.concat(deleteFilesInFs);

      return Promise.all(deleteAllFilesRecords);
    })
    .then(() => res.json('Covers deleted'))
    .catch(err => res.status(500).json({ message: err.message }));
});

router.get('/exp/purgeimg', (req, res) => {
  Character.find().exec()
    .then((charRes) => {
      const charPr = charRes.map(char => Character.findByIdAndUpdate(char._id, { image: '' }));

      return Promise.all(charPr);
    })
    .then(() => res.json('Images deleted'))
    .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;
