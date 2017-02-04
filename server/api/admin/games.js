const router = require('express').Router();
const Game = require('../../models/game');
const controller = require('../../controller/admin');
const multer = require('../../controller/multer');

const upload = multer.single('cover');

router.route('/')
  .get(async (req, res, next) => {
    const params = controller.queryParams(req.query);
    try {
      const games =
        await Game.find(params.filter)
          .skip(params.skip)
          .limit(params.limit)
          .sort(params.sort)
          .exec();

      if (Object.keys(params.filter).length > 0) {
        res.set({ 'X-Total-Count': games.length });
      } else {
        const count = await Game.count({});
        res.set({ 'X-Total-Count': count });
      }

      return res.json(games);
    } catch (e) {
      return next(e);
    }
  })

  .post(upload, async (req, res, next) => {
    try {
      const newGame = JSON.parse(req.body.payload);

      if (req.file) {
        newGame.cover = await controller.dealWithFile(req.file);
      }

      await Game.create(newGame);
      return res.status(201).json({ message: 'Game successfully created.' });
    } catch (e) {
      return next(e);
    }
  });

router.route('/:id')
  .patch(upload, async (req, res, next) => {
    try {
      // FormData with json in payload and optional file || simple json
      const update = req.body.payload ? JSON.parse(req.body.payload) : req.body;

      if (req.file) {
        update.cover = await controller.dealWithFile(req.file);
      }

      const currentGame = await Game.findById(req.params.id).lean().exec();
      await Game.findByIdAndUpdate(req.params.id, Object.assign({}, currentGame, update)).exec();

      if (update.order !== currentGame.order) {
        const needSwap = (await Game.find({ order: update.order }).where('_id').ne(req.params.id).exec())[0];
        needSwap.order = currentGame.order;
        await needSwap.save();
      }

      // if { cover: 'new' } or { cover: '' }
      if (currentGame.cover && typeof update.cover === 'string' && currentGame.cover !== update.cover) {
        await controller.deleteAllImg(currentGame.cover);
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
      return res.status(200).json({ message: 'Game successfully deleted' });
    } catch (e) {
      return next(e);
    }
  });

module.exports = router;
