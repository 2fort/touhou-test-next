const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_ADDRESS);
mongoose.set('debug', true);

app.use(express.static("public"));
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/api', require('./api'));


app.listen(8082, () => console.log('api server running at port 8082'));
