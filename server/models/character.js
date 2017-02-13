const mongoose = require('mongoose');
const utils = require('./utils');

const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: '',
  },
  art: {
    author: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
  },
  wiki: {
    type: String,
    default: '',
  },
  slug: {
    type: String,
    default: '',
  },
  _game: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
  },
  _order: {
    type: Number,
  },
});

schema.set('toJSON', {
  transform: utils.noUnderscoreDangle,
  virtuals: true,
});

schema.set('toObject', {
  transform: utils.noUnderscoreDangle,
  virtuals: true,
});

schema.pre('save', function saveHook(next) {
  this.slug = utils.makeSlug(this.name);
  return next();
});

schema.pre('findOneAndUpdate', function updateHook(next) {
  this.getUpdate().slug = utils.makeSlug(this.getUpdate().name);
  return next();
});

module.exports = mongoose.model('Character', schema);
