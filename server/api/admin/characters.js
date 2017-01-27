const router = require('express').Router();
const _ = require('lodash');
const Character = require('../../models/character');

router.get('/', (req, res) => {
  Character.find().populate('_game', 'title').exec()
    .then(characters => res.json(characters))
    .catch(err => res.status(404).json({ message: err.message }));
});

router.post('/new', (req, res) => {
  return res.status(201).end();
});

router.post('/edit', (req, res) => {
  /* Character.findByIdAndUpdate(req.params.id, req.body).exec()
    .then(() => res.end())
    .catch(err => res.status(500).json({ message: err.message }));*/
  return res.end();
});

router.post('/del', (req, res) => {
  /* Character.findByIdAndUpdate(req.params.id, req.body).exec()
    .then(() => res.end())
    .catch(err => res.status(500).json({ message: err.message }));*/
  return res.end();
});

module.exports = router;
