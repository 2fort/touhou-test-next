const router = require('express').Router();
const Character = require('../models/character');
const characters = require('../../client/src/json/characters.json');

router.get('/hello',  (req, res) => {
  res.json({ message: 'hello'});
});

module.exports = router;
