const mongoose = require('mongoose');
const utils = require('./utils');

const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  art: {
    author: String,
    url: String,
  },
  wiki: String,
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  published: {
    type: Boolean,
    required: true,
    default: false,
  },
  link: {
    rel: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
    },
    order: {
      type: Number,
    },
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

/* schema.pre('save', function saveHook(next) {
  this.slug = utils.makeSlug(this.name);
  return next();
});

schema.pre('findOneAndUpdate', function updateHook(next) {
  this.getUpdate().slug = utils.makeSlug(this.getUpdate().name);
  return next();
});*/

module.exports = mongoose.model('Character', schema);
