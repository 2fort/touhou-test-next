const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const _ = require('lodash');
const shortid = require('shortid');
const Game = require('../../models/game');
const utils = require('../../lib/utils');
const config = require('../../config');

const storage = multer.diskStorage({
  destination: config.UPLOAD_TEMP,
  filename: (req, file, cb) => {
    cb(null, shortid.generate() + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
});

router.get('/', (req, res) => {
  Game.find().exec()
    .then(games => res.json(games))
    // .then(games => setTimeout(() => res.json(games), 5000))
    .catch(err => res.status(404).json(err));
});

router.route('/edit/:id')
  .get((req, res) => {
    const id = req.params.id;
    Game.findById(id).exec()
      .then(game => res.json(game))
      .catch(err => res.status(404).json(err));
  })
  .post(upload.single('newcover'), async (req, res) => {
    const id = req.params.id;

    // save FormData to new object
    const update = Object.assign({}, req.body);
    // generate slug from title
    update.slug = _.snakeCase(update.title);
    // 'null' => null
    update.year = JSON.parse(update.year);

    if (req.file) {
      try {
        // add filename of new cover to update object
        update.cover = req.file.filename;

        // if uploaded image has a .svg extension
        if (path.extname(req.file.filename) === '.svg') {
          // just copy it to COMPRESSED and THUMBNAIL folders
          await utils.copyOneToMany(config.UPLOAD_TEMP, req.file.filename, [config.IMG_COMPRESSED, config.IMG_THUMBNAIL]);
          // move uploaded file to IMG_ORIG folder
          await utils.moveFile(req.file.path, config.IMG_ORIG + req.file.filename);
        } else {
          // generate compressed image
          await utils.resizeWithSharp(req.file.path, req.file.filename, null, 768, config.IMG_COMPRESSED);
          // generate thumbnail image
          await utils.resizeWithSharp(req.file.path, req.file.filename, 150, 150, config.IMG_THUMBNAIL);
          // move uploaded file to IMG_ORIG folder
          await utils.moveFile(req.file.path, config.IMG_ORIG + req.file.filename);
        }

        // if game had cover previosely, delete it from all folders
        if (req.body.cover) {
          const files = [
            config.IMG_ORIG + req.body.cover,
            config.IMG_COMPRESSED + req.body.cover,
            config.IMG_THUMBNAIL + req.body.cover,
          ];

          await utils.deleteMany(files);
        }
      } catch (e) {
        return res.status(500).json({ message: e.message });
      }
    }

    try {
      const updatedData = await Game.findByIdAndUpdate(id, update, { new: true });

      return res.json(updatedData);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  });

router.post('/new', upload.single('cover'), async (req, res) => {
  const newGame = Object.assign({}, req.body);
  newGame.slug = _.snakeCase(newGame.title);
  newGame.year = JSON.parse(newGame.year);

  console.log(newGame);

  if (req.file) {
    try {
      newGame.cover = req.file.filename;

      // if uploaded image has a .svg extension
      if (path.extname(req.file.filename) === '.svg') {
        // just copy it to COMPRESSED and THUMBNAIL folders
        await utils.copyOneToMany(config.UPLOAD_TEMP, req.file.filename, [config.IMG_COMPRESSED, config.IMG_THUMBNAIL]);
        // move uploaded file to IMG_ORIG folder
        await utils.moveFile(req.file.path, config.IMG_ORIG + req.file.filename);
      } else {
        // generate compressed image
        await utils.resizeWithSharp(req.file.path, req.file.filename, null, 768, config.IMG_COMPRESSED);
        // generate thumbnail image
        await utils.resizeWithSharp(req.file.path, req.file.filename, 150, 150, config.IMG_THUMBNAIL);
        // move uploaded file to IMG_ORIG folder
        await utils.moveFile(req.file.path, config.IMG_ORIG + req.file.filename);
      }
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  try {
    await Game.create(newGame);
    return res.json({ message: 'Game created' });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

module.exports = router;
