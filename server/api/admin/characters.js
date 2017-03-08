const router = require('express').Router();
const _ = require('lodash');
const Character = require('../../models/character');
const controller = require('../../controller/admin');
const multer = require('../../controller/multer');
const charController = require('./characters.controller');

const upload = multer.single('image');

router.route('/')
  .get(async (req, res, next) => {
    try {
      const params = controller.queryParams(req.query, ['link.rel']);

      let func = Character.aggregate()
        .match(params.filter)
        .lookup({
          from: 'games',
          localField: 'link.rel',
          foreignField: '_id',
          as: 'link.rel',
        })
        .append({
          $unwind: { path: '$link.rel', preserveNullAndEmptyArrays: true },
        })
        .append({
          $addFields: {
            id: '$_id',
            game: '$link.rel.title',
            'link.rel.id': '$link.rel._id',
          },
        });

      if (params.sort) {
        func = func.sort(params.sort);
      }

      func = func.project({
        _id: 0,
        __v: 0,
        'link.rel._id': 0,
        'link.rel.__v': 0,
      });

      if (params.skip) {
        func = func.skip(params.skip);
      }

      if (params.limit) {
        func = func.limit(params.limit);
      }

      const characters = await func.exec();

      const count = await Character.count(params.filter);
      res.set({ 'X-Total-Count': count });

      return res.json(characters);
    } catch (e) {
      return next(e);
    }
  })
  .post(upload, async (req, res, next) => {
    try {
      const newData = JSON.parse(req.body.payload);
      newData.slug = _.snakeCase(newData.name);

      if (req.file) {
        newData.image = await controller.dealWithFile(req.file);
      }

      const newGame = await Character.create(newData);

      const gameId = newData.link && newData.link.rel;

      if (gameId) {
        await charController.addCharacterToGame(gameId, newGame._id, newData.link.order);
      }

      return res.status(201).json({ message: `Character "${newData.name}" successfully created` });
    } catch (e) {
      return next(e);
    }
  });

router.route('/:id')
  .get(async (req, res, next) => {
    try {
      const char = await Character.findById(req.params.id).exec();
      return res.json(char);
    } catch (e) {
      return next(e);
    }
  })
  .put(upload, async (req, res, next) => {
    try {
      const newData = JSON.parse(req.body.payload);
      newData.slug = _.snakeCase(newData.name);

      if (req.file) {
        newData.image = await controller.dealWithFile(req.file);
      } else {
        newData.image = newData.image || '';
      }

      if (newData.link && newData.link.rel === '') {
        newData.link.rel = null;
        newData.link.order = null;
      }

      const staleData = await Character.findOneAndUpdate({ _id: req.params.id }, newData);

      const gameIdNew = newData.link && newData.link.rel;
      const gameIdStale = staleData.link && staleData.link.rel;

      if (!gameIdStale && gameIdNew) {
        await charController.addCharacterToGame(gameIdNew, staleData._id, newData.link.order);
      }

      if (gameIdStale && !gameIdNew) {
        await charController.removeCharacterFromGame(gameIdStale, staleData.link.order);
      }

      if (gameIdStale && gameIdNew && gameIdNew === gameIdStale.toString()) {
        await charController.reorderAfterUpdate(gameIdNew, staleData._id, newData.link.order, staleData.link.order);
      }

      if (gameIdStale && gameIdNew && gameIdNew !== gameIdStale.toString()) {
        await Promise.all([
          charController.addCharacterToGame(gameIdNew, staleData._id, newData.link.order),
          charController.removeCharacterFromGame(gameIdStale, staleData.link.order),
        ]);
      }

      if (staleData.order !== newData.order) {
        await charController.reorderAfterUpdate(newData.order, staleData.order, req.params.id);
      }

      if (staleData.cover && staleData.cover !== newData.cover) {
        await controller.deleteAllImg(staleData.cover);
      }

      return res.status(200).json({ message: `Character "${newData.name}" successfully updated.` });
    } catch (e) {
      return next(e);
    }
  })
  .patch(async (req, res, next) => {
    try {
      switch (req.query.action) {
        case 'swaporder': {
          const data = req.body;

          const character = await Character.findOne({ _id: req.params.id }).exec();
          const neighbor = await Character.findOne({ 'link.rel': character.link.rel, 'link.order': data.link.order }).exec();

          neighbor.link.order = character.link.order;
          neighbor.save();

          character.link.order = data.link.order;
          character.save();

          break;
        }
        default: {
          return res.status(500).json({ message: 'Unknown action' });
        }
      }

      return res.status(200).json({ message: 'Game successfully updated.' });
    } catch (e) {
      return next(e);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const deletedCharacter = await Character.findByIdAndRemove(req.params.id);

      if (deletedCharacter.image) {
        await controller.deleteAllImg(deletedCharacter.image);
      }

      const gameId = deletedCharacter.link && deletedCharacter.link.rel;

      if (gameId) {
        await charController.removeCharacterFromGame(gameId, deletedCharacter.link.order);
      }

      return res.status(200).json({ message: `Character "${deletedCharacter.name}" successfully deleted` });
    } catch (e) {
      return next(e);
    }
  });

module.exports = router;
