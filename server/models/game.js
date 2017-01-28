const mongoose = require('mongoose');
const utils = require('./utils');

const schema = new mongoose.Schema({
  prefix: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    default: null,
  },
  cover: {
    type: String,
    default: '',
  },
  slug: String,
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

schema.pre('save', function saveHook(next) {
  this.slug = utils.makeSlug(this.title);
  // if year exist, it will be like '1998' or 'null'
  this.year = this.year && JSON.parse(this.year);
  return next();
});

schema.pre('findOneAndUpdate', function updateHook(next) {
  this.getUpdate().slug = utils.makeSlug(this.getUpdate().title);

  const year = this.getUpdate().year;
  this.getUpdate().year = year && JSON.parse(year);
  return next();
});

module.exports = mongoose.model('Game', schema);
