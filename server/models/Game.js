const mongoose = require('mongoose');
const utils = require('./utils');

const schema = new mongoose.Schema({
  prefix: String,
  title: {
    type: String,
    required: true,
    unique: true,
  },
  year: Number,
  cover: String,
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  order: {
    type: Number,
    required: true,
  },
});

/* schema.virtual('created').get( function () {
  if (this["_created"]) return this["_created"];
  return this["_created"] = this._id.getTimestamp();
});*/

schema.set('toJSON', {
  transform: utils.noUnderscoreDangle,
  virtuals: true,
});

schema.set('toObject', {
  transform: utils.noUnderscoreDangle,
  virtuals: true,
});

/* schema.pre('save', function saveHook(next) {
  this.slug = utils.makeSlug(this.title);
  return next();
});*/

/* schema.pre('findOneAndUpdate', function updateHook(next) {
  this.getUpdate().slug = utils.makeSlug(this.getUpdate().title);
  return next();
}); */

module.exports = mongoose.model('Game', schema);
