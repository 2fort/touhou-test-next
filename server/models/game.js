const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  prefix: String,
  title: {
    type: String,
    required: true,
  },
  year: Number,
  cover: String,
});

module.exports = mongoose.model('game', schema);
