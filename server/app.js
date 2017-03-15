const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const config = require('./config');
require('./controller/passport');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_ADDRESS);
mongoose.set('debug', true);

app.use(express.static('public'));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());

app.use('/api', require('./api'));

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({ message: err.message });
}

app.use(errorHandler);

app.listen(8082, () => console.log('api server running at port 8082'));
