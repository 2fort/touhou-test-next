const router = require('express').Router();
const Game = require('../../models/game');
const controller = require('../../controller/admin');
const multer = require('../../controller/multer');

const upload = multer.single('cover');

router.route('/')
  .get((req, res) => {
    Game.find().exec()
      .then(games => res.json(games))
      // .then(games => setTimeout(() => res.json(games), 5000))
      .catch(e => res.status(404).json({ message: e.message }));
  })

  .post(upload, async (req, res) => {
    const newGame = controller.dealWithPayload(req.body.payload);

    try {
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
      const update = controller.dealWithPayload(req.body.payload);

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
