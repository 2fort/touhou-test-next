const router = require('express').Router();
const _ = require('lodash');
const Game = require('../../models/game');
const controller = require('../../controller/admin');
const multer = require('../../controller/multer');

const upload = multer.single('cover');

router.route('/')
  .get(async (req, res, next) => {
    const params = controller.queryParams(req.query, 'year');

    let func = Game
        .aggregate()
        .match(params.filter)
        .lookup({
          from: 'characters',
          localField: '_id',
          foreignField: '_game',
          as: 'chars',
        })
        .append({
          $addFields: {
            chars: { $size: '$chars' },
            id: '$_id',
          },
        })
        .project({
          _id: 0,
          prefix: 1,
          title: 1,
          slug: 1,
          year: 1,
          cover: 1,
          order: 1,
          chars: 1,
          id: 1,
        })
        .sort(params.sort || 'order');

    if (params.skip) {
      func = func.skip(params.skip);
    }

    if (params.limit) {
      func = func.limit(params.limit);
    }

    try {
      const games = await func.exec();

      const count = await Game.count(params.filter);
      res.set({ 'X-Total-Count': count });

      return res.json(games);
    } catch (e) {
      return next(e);
    }
  })

  .post(upload, async (req, res, next) => {
    try {
      const newJson = req.body.payload ? JSON.parse(req.body.payload) : req.body;

      // find max value for order field, it can be useful in future
      const maxOrder = (await Game.find().sort('-order').limit(1).exec())[0].order || 1;

      // do we have a file?
      if (req.file) {
        // yep! compress, save and return filename
        newJson.cover = await controller.dealWithFile(req.file);
      }

      // do we have field 'order' in newJson object?
      if (newJson.order) {
        // yes we have! does it satisfies the restrictions?
        // order of new Game can't be less than 1 and greater than max + 1
        if (newJson.order < 1 || newJson.order > maxOrder + 1) {
          throw new Error('Bad order value.');
        }
      } else {
        // of not, find game with max order
        const lastOrderArr = await Game.find().sort('-order').limit(1).exec();
        // new game will have { order: 1 } if collection was empty or max + 1 othervise
        newJson.order = !lastOrderArr[0] ? 1 : lastOrderArr[0].order + 1;
      }

      // create new game
      const newGame = await Game.create(newJson);

      // if order less than maxOrder + 1, it means we need to re-arrange some entities
      if (newJson.order < maxOrder + 1) {
        const result = await Game.find({ order: { $gte: newJson.order }, _id: { $ne: newGame._id } }).exec();
        const changeOrder = result.map(game => Game.update({ _id: game._id }, { $inc: { order: 1 } }));
        await Promise.all(changeOrder);
      }

      return res.status(201).json({ message: 'Game successfully created.' });
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
  .patch(upload, async (req, res, next) => {
    try {
      // FormData with json in payload and optional file || simple json
      const update = req.body.payload ? JSON.parse(req.body.payload) : req.body;

      // find game which needs to be updated
      const gameBeforeUpdate = await Game.findById(req.params.id).lean().exec();

      // do we have field 'order' in update object?
      if (update.order) {
        // yes we have! does it satisfies the restrictions? first, find max value
        const maxOrder = (await Game.find().sort('-order').limit(1).exec())[0].order;
        // order can't be less than 1 and greater than max value in collection
        if (update.order < 1 || update.order > maxOrder) {
          throw new Error('Bad order value.');
        }
      }

      // do we have a file?
      if (req.file) {
        // yep! compress, save and return filename
        update.cover = await controller.dealWithFile(req.file);
      }

      // title was changed? if so, update slug
      if (update.title && update.title !== gameBeforeUpdate.title) {
        update.slug = _.snakeCase(update.title);
      }

      // time to update the game!
      await Game.update({ _id: req.params.id }, update).exec();

      // no errors so far, time to compare some values before and after update

      // does order was changed?
      if (update.order && update.order !== gameBeforeUpdate.order) {
        // yep. let's assume new order greater than older
        let range = { $gt: gameBeforeUpdate.order, $lte: update.order };
        let inc = { $inc: { order: -1 } };

        // may be it's not true?
        if (update.order < gameBeforeUpdate.order) {
          range = { $gte: update.order, $lt: gameBeforeUpdate.order };
          inc = { $inc: { order: 1 } };
        }

        // ok, let's find entities which needs to be re-ordered
        const result = await Game.find({ order: range, _id: { $ne: req.params.id } }).exec();
        const changeOrder = result.map(game => Game.update({ _id: game._id }, inc));
        await Promise.all(changeOrder);
      }

      // does cover was changed? If yes, delete old covers
      // { cover: '' } means, `no new cover, just delete the old one`
      if (gameBeforeUpdate.cover && typeof update.cover === 'string' && gameBeforeUpdate.cover !== update.cover) {
        await controller.deleteAllImg(gameBeforeUpdate.cover);
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

      const result = await Game.find({ order: { $gt: deletedGame.order } }).exec();
      if (result[0]) {
        const changeOrder = result.map(game => Game.update({ _id: game._id }, { $inc: { order: -1 } }));
        await Promise.all(changeOrder);
      }

      return res.status(200).json({ message: 'Game successfully deleted' });
    } catch (e) {
      return next(e);
    }
  });

module.exports = router;
