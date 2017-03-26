const User = require('../models/User');
const jwt = require('jwt-simple');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.SECRET);
}

this.signup = async function signup(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(422).send({ message: 'You must provide username and password' });
  }

  try {
    const userExists = await User.findOne({ username }).exec();

    if (userExists) {
      return res.status(422).send({ message: 'Email is in use' });
    }

    const user = new User({ username, password });
    await user.save();

    return res.json({ token: tokenForUser(user) });
  } catch (e) {
    return next(e);
  }
};

this.signin = function signin(req, res) {
  return res.json({ token: tokenForUser(req.user) });
};
