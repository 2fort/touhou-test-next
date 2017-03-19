const router = require('express').Router();
const _ = require('lodash');
const Game = require('../../models/Game');
const Character = require('../../models/Character');
const controller = require('../../controller/admin');
const multer = require('../../controller/multer');
const gameController = require('./games.controller');

const upload = multer.single('cover');

router.route('/')
  .get(async (req, res, next) => {
    try {
      if (req.query.action) {
        await gameController.actions(req.query.action, res);
        return null;
      }

      const params = controller.queryParams(req.query);

      if (params.sort === 'title') {
        params.sort = 'normalized';
      }

      let func = Game
        .aggregate()
        .match(params.filter)
        .lookup({
          from: 'characters',
          localField: '_id',
          foreignField: 'link.rel',
          as: 'chars',
        })
        .append({
          $addFields: {
            chars: { $size: '$chars' },
            id: '$_id',
            normalized: { $toLower: '$title' },
          },
        })
        .project({
          _id: 0,
          __v: 0,
        })
        .sort(params.sort || 'order');

      if (params.skip) {
        func = func.skip(params.skip);
      }

      if (params.limit) {
        func = func.limit(params.limit);
      }

      const games = await func.exec();
      const count = await Game.count(params.filter);
      res.set({ 'X-Total-Count': count });

      // return setTimeout(() => res.json(games), 3000);
      return res.json(games);
    } catch (e) {
      return next(e);
    }
  })
  .post(upload, async (req, res, next) => {
    try {
      const newData = JSON.parse(req.body.payload);
      newData.slug = _.snakeCase(newData.title);

      if (req.file) {
        newData.cover = await controller.dealWithFile(req.file);
      }

      const newGame = await Game.create(newData);

      await Game.updateMany({ order: { $gte: newData.order }, _id: { $ne: newGame._id } }, { $inc: { order: 1 } });

      // return setTimeout(() => res.status(201).json({ message: 'Game successfully created.' }), 3000);
      return res.status(201).json({ message: `Game ${newData.title} successfully created.` });
    } catch (e) {
      return next(e);
    }
  });

router.route('/:id')
  .get(async (req, res, next) => {
    try {
      const game = await Game.findById(req.params.id).exec();
      return res.json(game);
    } catch (e) {
      return next(e);
    }
  })
  .put(upload, async (req, res, next) => {
    try {
      const newData = JSON.parse(req.body.payload);
      newData.slug = _.snakeCase(newData.title);

      if (req.file) {
        newData.cover = await controller.dealWithFile(req.file);
      } else {
        newData.cover = newData.cover || '';
      }

      const staleData = await Game.findOneAndUpdate({ _id: req.params.id }, newData);

      if (staleData.order !== newData.order) {
        await gameController.reorderAfterUpdate(newData.order, staleData.order, req.params.id);
      }

      if (staleData.cover && staleData.cover !== newData.cover) {
        await controller.deleteAllImg(staleData.cover);
      }

      // return setTimeout(() => res.status(200).json({ message: 'Game successfully updated.' }), 3000);
      return res.status(200).json({ message: `Game ${newData.title} successfully updated.` });
    } catch (e) {
      return next(e);
    }
  })
  .patch(upload, async (req, res, next) => {
    try {
      switch (req.query.action) {
        case 'swaporder': {
          const swap = await Game.findOne({ order: req.body.order }).exec();
          const staleData = await Game.findOneAndUpdate({ _id: req.params.id }, { order: req.body.order });
          swap.order = staleData.order;
          swap.save();
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
      const deletedGame = await Game.findByIdAndRemove(req.params.id);

      if (deletedGame.cover) {
        await controller.deleteAllImg(deletedGame.cover);
      }

      await Game.updateMany({ order: { $gt: deletedGame.order } }, { $inc: { order: -1 } });
      await gameController.removeLinkAfterDelete(deletedGame._id);

      return res.status(200).json({ message: 'Game successfully deleted' });
    } catch (e) {
      return next(e);
    }
  });

router.get('/:id/characters', async (req, res, next) => {
  try {
    const params = controller.queryParams(req.query);
    const match = Object.assign({}, { 'link.rel': req.params.id }, params.filter);

    let func = Character.find(match);

    if (params.sort) {
      func = func.sort(params.sort);
    }

    if (params.skip) {
      func = func.skip(params.skip);
    }

    if (params.limit) {
      func = func.limit(params.limit);
    }

    const characters = await func.exec();

    const count = await Character.count(match);
    res.set({ 'X-Total-Count': count });

    return res.json(characters);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
