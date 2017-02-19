const router = require('express').Router();
const Character = require('../../models/character');
const controller = require('../../controller/admin');
const multer = require('../../controller/multer');
const ObjectId = require('mongodb').ObjectId;

const upload = multer.single('image');

router.route('/')
  .get(async (req, res, next) => {
    try {
      // { _game: '12345gf67' } => { _game: '12345gf67' } => means "show all characters from game with id: '12345gf67'"
      // { _game: '' } => { _game: null } => means "show all uncategorized characters"
      // { _game: undefined } => {} => means "show all characters"
      const filter = (_game) => {
        if (_game === '') return { _game: null };
        if (_game === undefined) return {};
        return { _game: ObjectId(_game) };
      };

      const params = controller.queryParams(req.query);
      params.filter = Object.assign({}, params.filter, filter(req.query._game));

      let func = Character.aggregate()
          .match(params.filter)
          .lookup({
            from: 'games',
            localField: '_game',
            foreignField: '_id',
            as: '_game',
          })
          .append({
            $unwind: { path: '$_game', preserveNullAndEmptyArrays: true },
          })
          .append({
            $addFields: {
              id: '$_id',
              game: '$_game.title',
              '_game.id': '$_game._id',
            },
          });

      if (params.sort) {
        func = func.sort(params.sort);
      }

      func = func.project({
        _id: 0,
        __v: 0,
        '_game._id': 0,
        '_game.__v': 0,
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
      const newCharacter = JSON.parse(req.body.payload);

      if (req.file) {
        newCharacter.image = await controller.dealWithFile(req.file);
      }

      await Character.create(newCharacter);
      return res.status(201).json({ message: 'Character successfully created' });
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
        update.image = await controller.dealWithFile(req.file);
      }

      const staleData = await Character.findByIdAndUpdate(req.params.id, update);

      if (staleData.image && staleData.image !== update.image) {
        await controller.deleteAllImg(staleData.image);
      }

      return res.status(200).json({ message: 'Character successfully updated.' });
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
      return res.status(200).json({ message: 'Character successfully deleted' });
    } catch (e) {
      return next(e);
    }
  });

module.exports = router;
