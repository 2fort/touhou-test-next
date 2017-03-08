const Game = require('../../models/game');
const Character = require('../../models/character');

this.reorderAfterUpdate = async function reorderAfterUpdate(order, previousOrder, id) {
  const range = (order > previousOrder)
    ? { $gt: previousOrder, $lte: order }
    : { $gte: order, $lt: previousOrder };

  const inc = (order > previousOrder)
    ? { $inc: { order: -1 } }
    : { $inc: { order: 1 } };

  await Game.updateMany({ order: range, _id: { $ne: id } }, inc);
};

this.actions = async function actions(action, res) {
  switch (action) {
    case 'maxorder': {
      const game = await Game.find().sort('-order').limit(1).exec();
      const maxOrder = game[0] ? game[0].order : 0;
      return res.json({ maxOrder });
    }
    default:
      throw new Error('Unknown action');
  }
};

this.removeLinkAfterDelete = async function removeLinkAfterDelete(gameId) {
  await Character.updateMany({ 'link.rel': gameId }, { 'link.rel': null, 'link.order': null });
};
