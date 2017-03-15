const bcrypt = require('bcrypt-nodejs');

module.exports = {
  genSalt: () => new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err);
      return resolve(salt);
    });
  }),
  hash: (password, salt) => new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, null, (err, hash) => {
      if (err) return reject(err);
      return resolve(hash);
    });
  }),
  compare: (candidatePassword, currentPassword) => new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, currentPassword, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  }),
};
