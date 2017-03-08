const Character = require('../../models/character');

this.addCharacterToGame = async function addCharacterToGame(gameId, charId, order) {
  await Character.updateMany({
    'link.rel': gameId,
    'link.order': { $gte: order },
    _id: { $ne: charId },
  }, { $inc: { 'link.order': 1 },
  });
};

this.removeCharacterFromGame = async function removeCharacterFromGame(gameId, order) {
  await Character.updateMany({
    'link.rel': gameId,
    'link.order': { $gt: order },
  }, { $inc: { 'link.order': -1 },
  });
};

this.reorderAfterUpdate = async function reorderAfterUpdate(gameId, charId, newOrder, previousOrder) {
  const range = (newOrder > previousOrder)
    ? { $gt: previousOrder, $lte: newOrder }
    : { $gte: newOrder, $lt: previousOrder };

  const inc = (newOrder > previousOrder)
    ? { $inc: { 'link.order': -1 } }
    : { $inc: { 'link.order': 1 } };

  await Character.updateMany({ 'link.rel': gameId, 'link.order': range, _id: { $ne: charId } }, inc);
};
