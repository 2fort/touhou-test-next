const path = require('path');
const _ = require('lodash');
const utils = require('../lib/utils');
const config = require('../config');

this.dealWithPayload = function dealWithPayload(payload) {
  // parse payload
  const data = JSON.parse(payload);
  // generate slug from title
  data.slug = _.snakeCase(data.title);
  // if year exist, it will be like '1998' or 'null'
  data.year = data.year && JSON.parse(data.year);

  return data;
};

this.dealWithFile = async function dealWithFile(file) {
  // if uploaded image has a .svg extension
  if (path.extname(file.filename) === '.svg') {
    // just copy it to COMPRESSED and THUMBNAIL folders
    await utils.copyOneToMany(config.UPLOAD_TEMP, file.filename, [config.IMG_COMPRESSED, config.IMG_THUMBNAIL]);
    // move uploaded file to IMG_ORIG folder
    await utils.moveFile(file.path, config.IMG_ORIG + file.filename);
  } else {
    await Promise.all([
      // generate compressed image
      utils.resizeWithSharp(file.path, file.filename, null, 768, config.IMG_COMPRESSED),
      // generate thumbnail image
      utils.resizeWithSharp(file.path, file.filename, 150, 150, config.IMG_THUMBNAIL),
    ]);
    // move uploaded file to IMG_ORIG folder
    await utils.moveFile(file.path, config.IMG_ORIG + file.filename);
  }
  return file.filename;
};

this.deleteAllImg = function deleteAllImg(image) {
  const paths = [
    config.IMG_ORIG + image,
    config.IMG_COMPRESSED + image,
    config.IMG_THUMBNAIL + image,
  ];
  return utils.deleteMany(paths);
};
