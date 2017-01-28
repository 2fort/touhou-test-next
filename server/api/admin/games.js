const router = require('express').Router();
const Game = require('../../models/game');
const controller = require('../../controller/admin');
const multer = require('../../controller/multer');

const upload = multer.single('cover');

router.route('/')
  .get(async (req, res) => {
    try {
      const games = await Game.find().exec();
      return res.json(games);
    } catch (e) {
      return res.status(404).json({ message: e.message });
    }
  })

  .post(upload, async (req, res) => {
    try {
      const newGame = JSON.parse(req.body.payload);

      if (req.file) {
        newGame.cover = await controller.dealWithFile(req.file);
      }

      await Game.create(newGame);
      return res.status(201).json({ message: 'Game successfully created.' });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  });

router.route('/:id')
  .patch(upload, async (req, res) => {
    try {
      const update = JSON.parse(req.body.payload);

      if (req.file) {
        update.cover = await controller.dealWithFile(req.file);
      }

      const staleData = await Game.findByIdAndUpdate(req.params.id, update);

      if (staleData.cover && staleData.cover !== update.cover) {
        await controller.deleteAllImg(staleData.cover);
      }

      return res.status(200).json({ message: 'Game successfully updated.' });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  })

  .delete(async (req, res) => {
    try {
      const deletedGame = await Game.findByIdAndRemove(req.params.id);
      if (deletedGame.cover) {
        await controller.deleteAllImg(deletedGame.cover);
      }
      return res.status(200).json({ message: 'Game successfully deleted' });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  });

module.exports = router;
