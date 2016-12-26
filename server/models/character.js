const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  _game: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
  },
});

schema.set('toJSON', {
  transform: function (doc, ret, options) {
    // ret.id = ret._id;
    // delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Character', schema);
