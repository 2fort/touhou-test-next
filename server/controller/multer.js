const shortid = require('shortid');
const multer = require('multer');
const path = require('path');
const config = require('../config');

const storage = multer.diskStorage({
  destination: config.UPLOAD_TEMP,
  filename: (req, file, cb) => {
    cb(null, shortid.generate() + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({ storage });

module.exports = upload;
