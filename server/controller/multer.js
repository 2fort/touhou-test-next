const shortid = require('shortid');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: process.env.UPLOAD_TEMP,
  filename: (req, file, cb) => {
    cb(null, shortid.generate() + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({ storage });

module.exports = upload;
