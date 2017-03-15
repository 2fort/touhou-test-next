const mongoose = require('mongoose');
const bcryptPr = require('../lib/bcryptPr');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
});

userSchema.pre('save', async function userPreSave(next) {
  const user = this;

  try {
    const salt = await bcryptPr.genSalt();
    user.password = await bcryptPr.hash(user.password, salt);
    return next();
  } catch (e) {
    return next(e);
  }
});

module.exports = mongoose.model('user', userSchema);
