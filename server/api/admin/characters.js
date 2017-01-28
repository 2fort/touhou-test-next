const router = require('express').Router();
const Character = require('../../models/character');
const controller = require('../../controller/admin');
const multer = require('../../controller/multer');

const upload = multer.single('image');

router.route('/')
  .get(async (req, res) => {
    try {
      const characters = await Character.find().populate('_game', 'title').exec();
      return res.json(characters);
    } catch (e) {
      return res.status(404).json({ message: e.message });
    }
  })

  .post(upload, async (req, res) => {
    try {
      const newCharacter = JSON.parse(req.body.payload);

      if (req.file) {
        newCharacter.image = await controller.dealWithFile(req.file);
      }

      await Character.create(newCharacter);
      return res.status(201).json({ message: 'Character successfully created' });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  });


router.route('/:id')
  .patch(upload, async (req, res) => {
    try {
      const update = JSON.parse(req.body.payload);

      if (req.file) {
        update.image = await controller.dealWithFile(req.file);
      }

      const staleData = await Character.findByIdAndUpdate(req.params.id, update);

      if (staleData.image && staleData.image !== update.image) {
        await controller.deleteAllImg(staleData.image);
      }

      return res.status(200).json({ message: 'Character successfully updated.' });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  })

  .delete(async (req, res) => {
    try {
      const deletedCharacter = await Character.findByIdAndRemove(req.params.id);
      if (deletedCharacter.image) {
        await controller.deleteAllImg(deletedCharacter.image);
      }
      return res.status(200).json({ message: 'Character successfully deleted' });
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  });

module.exports = router;
