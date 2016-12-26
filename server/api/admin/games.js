const router = require('express').Router();
const _ = require('lodash');
const Game = require('../../models/game');

router.get('/', (req, res) => {
  Game.find().exec()
    .then((games) => {
      const send = games.map(game => {
        return game;
      });
      return res.json(send);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

router.route('/edit/:id')
  .get((req, res) => {
    const id = req.params.id;
    Game.findById(id).exec()
      .then((game) => {
        return res.json(game);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  })
  .post((req, res) => {
    const id = req.params.id;
    const update = req.body;
    update.slug = _.snakeCase(update.title);

    Game.findByIdAndUpdate(id, req.body)
      .then((response) => {
        return res.json(response);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  });

module.exports = router;
