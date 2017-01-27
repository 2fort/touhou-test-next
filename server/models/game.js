const mongoose = require('mongoose');

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
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
  virtuals: true,
});

schema.set('toObject', {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
  },
  virtuals: true,
});

module.exports = mongoose.model('Game', schema);
