const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  art: {
    author: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  wiki: String,
  slug: String,
  game_id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('character', schema);
