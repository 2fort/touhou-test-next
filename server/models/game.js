const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  prefix: String,
  title: {
    type: String,
    required: true,
  },
  year: Number,
  cover: String,
  slug: String,
});

schema.set('toJSON', {
  transform: function (doc, ret, options) {
    // ret.id = ret._id;
    // delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Game', schema);
