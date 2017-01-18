const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const _ = require('lodash');
const shortid = require('shortid');
const Game = require('../../models/game');

const storage = multer.diskStorage({
  destination: 'uploads/images/',
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage: storage,
}).single('cover');

router.get('/', (req, res) => {
  Game.find().exec()
    .then(games => res.json(games))
    //.then(games => setTimeout(() => res.json(games), 5000))
    .catch((err) => {
      return res.status(404).json(err);
    });
});

function resizeWithSharp(file) {
  return new Promise((resolve, reject) => {
    sharp(file.path)
      .resize(150, 150)
      .max()
      .toFile('public/images/games/' + file.filename, (err) => {
        if (err) reject(Error('Something wrong with sharp module'));
        resolve(true);
      });
  });
}

function deleteTempImage(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file.path, (err) => {
      if (err) return reject(Error(err));
      return resolve(true);
    });
  });
}

router.route('/edit/:id')
  .get((req, res) => {
    const id = req.params.id;
    Game.findById(id).exec()
      .then(game => res.json(game))
      .catch((err) => {
        return res.status(404).json(err);
      });
  })
  .post(upload, async (req, res) => {
    const id = req.params.id;
    const update = req.body;
    update.slug = _.snakeCase(update.title);

    if (req.file) {
      try {
        await resizeWithSharp(req.file);
        update.cover = req.file.filename;
        await deleteTempImage(req.file);
      } catch (e) {
        return res.status(500).json(e);
      }
    }

    // console.log(req.file);
    // console.log(req.body);

    try {
      const result = await Game.findByIdAndUpdate(id, update, { new: true });
      return res.json(result);
    } catch (e) {
      return res.status(500).json(e);
    }
  });

module.exports = router;
