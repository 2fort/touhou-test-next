const router = require('express').Router();
const _ = require('lodash');
const Character = require('../../models/character');
const controller = require('../../controller/admin');
const multer = require('../../controller/multer');

const upload = multer.single('image');

router.route('/')
  .get(async (req, res, next) => {
    try {
      const params = controller.queryParams(req.query, 'link.rel');

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
    // TODO: refactor this
    try {
      const newJson = req.body.payload ? JSON.parse(req.body.payload) : req.body;

      const charMaxOrderPromise = Character.find({ _game: newJson._game }).sort('-_order').limit(1).exec();

      if (newJson._game) {
        if (newJson._order) {
          const charMaxOrder = await charMaxOrderPromise;
          const maxOrder = charMaxOrder[0] ? charMaxOrder[0]._order : 0;

          if (newJson._order < 1 || newJson._order > maxOrder + 1) {
            throw new Error('Bad order value.');
          }

          const newChar = await Character.create(newJson);

          if (newJson._order < maxOrder + 1) {
            const result = await Character.find({
              _game: newJson._game,
              _order: { $gte: newJson._order },
              _id: { $ne: newChar._id },
            }).exec();

            const changeOrder = result.map(char => Character.update({ _id: char._id }, { $inc: { _order: 1 } }));
            await Promise.all(changeOrder);
          }
        } else {
          const charMaxOrder = await charMaxOrderPromise;
          newJson._order = charMaxOrder[0] ? charMaxOrder[0]._order + 1 : 1;
          await Character.create(newJson);
        }
      } else {
        if (newJson._order) {
          throw new Error('Can\'t set _order if _game is not provided');
        }

        await Character.create(newJson);
      }

      if (req.file) {
        newJson.image = await controller.dealWithFile(req.file);
      }

      return res.status(201).json({ message: 'Character successfully created' });
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
  .patch(upload, async (req, res, next) => {
    // TODO: refactor this
    try {
      // FormData with json in payload and optional file || simple json
      const update = req.body.payload ? JSON.parse(req.body.payload) : req.body;

      if (update._game === '') {
        update._game = null;
      }

      // find character which needs to be updated
      const charBeforeUpdate = await Character.findById(req.params.id).lean().exec();


      // do we have field 'order' in update object?
      if (update._order) {
        // yes we have! does it satisfies the restrictions? first, find max value
        const maxOrder = (await Character.find({ _game: charBeforeUpdate._game }).sort('-_order').limit(1).exec())[0]._order;
        // order can't be less than 1 and greater than max value among characters in selected _game
        if (update._order < 1 || update._order > maxOrder) {
          throw new Error('Bad order value.');
        }
      }

      // do we have a file?
      if (req.file) {
        // yep! compress, save and return filename
        update.image = await controller.dealWithFile(req.file);
      }

      // name was changed? if so, update slug
      if (update.name && update.name !== charBeforeUpdate.name) {
        update.slug = _.snakeCase(update.name);
      }

      // time to update character!
      await Character.update({ _id: req.params.id }, update).exec();

      // no errors so far, time to compare some values before and after update

      // does order was changed?
      if (update._order !== charBeforeUpdate._order) {
        // yep. let's assume new order greater than older
        let range = { $gt: charBeforeUpdate._order, $lte: update._order };
        let inc = { $inc: { _order: -1 } };

        // may be it's not true?
        if (update._order < charBeforeUpdate._order) {
          range = { $gte: update._order, $lt: charBeforeUpdate._order };
          inc = { $inc: { _order: 1 } };
        }

        // ok, let's find entities which needs to be re-ordered
        const result = await Character.find({
          _game: charBeforeUpdate._game,
          _order: range,
          _id: { $ne: req.params.id },
        }).exec();
        const changeOrder = result.map(char => Character.update({ _id: char._id }, inc));
        await Promise.all(changeOrder);
      }

      // does image was changed? If yes, delete old image
      // { image: '' } means, `no new image, just delete the old one`
      if (charBeforeUpdate.image && typeof update.image === 'string' && charBeforeUpdate.image !== update.image) {
        await controller.deleteAllImg(charBeforeUpdate.image);
      }

      return res.status(200).json({ message: 'Character successfully updated.' });
    } catch (e) {
      console.log(e);
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
