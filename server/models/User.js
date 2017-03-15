const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
});

userSchema.pre('save', function userPreSave(next) {
  const user = this;

  bcrypt.genSalt(10, (saltErr, salt) => {
    if (saltErr) { return next(saltErr); }

    bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
      if (hashErr) { return next(hashErr); }

      user.password = hash;
      return next();
    });

    return null;
  });
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    return callback(null, isMatch);
  });
};

module.exports = mongoose.model('user', userSchema);
