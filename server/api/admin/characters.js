const router = require('express').Router();
const _ = require('lodash');
const Character = require('../../models/character');

router.get('/', (req, res) => {
  // let offset = 0;

  /* if (req.query.start) {
    offset = Number(req.query.start);
  }*/

  /* Character.find().skip(offset).limit(10).populate('_game', 'title').exec()
    .then((characters) => {
      return res.json(characters);
    })
    .catch((err) => {
      return res.json(err);
    });*/

  Character.find().populate('_game', 'title').exec()
    .then(characters => res.json(characters))
    .catch((err) => {
      return res.status(404).json(err);
    });
});

router.route('/edit/:id')
  .get((req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(404).json({ message: "Error: bad id"});
    }

    Character.findById(id).exec()
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
