const router = require('express').Router();
const _ = require('lodash');
const Character = require('../../models/character');

router.get('/', (req, res) => {
  Character.find().populate('_game', 'title').exec()
    .then((characters) => {
      return res.json(characters);
    })
    .catch((err) => {
      return res.json(err);
    });
});

router.route('/edit/:id')
  .get((req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(404).json({ message: "Error: bad id"});
    }

    Character.findById(req.params.id).populate('_game', 'title').exec()
      .then((character) => {
        return res.json(character);
      })
      .catch((err) => {
        return res.status(404).json({ message: "Not found"});
      });
  })
  .post((req, res) => {
    Character.findByIdAndUpdate(req.params.id, req.body).exec()
      .then()
      .catch();
  });

module.exports = router;
