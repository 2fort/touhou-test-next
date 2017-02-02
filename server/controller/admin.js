const path = require('path');
const utils = require('../lib/utils');
const config = require('../config');

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

this.queryParams = function queryParams(query) {
  const params = {
    page: Number(query.page) || 1,
    limit: Number(query.limit) || 10,
    sort: query.sort || '',
    filter: query.filter || {},
  };

  params.skip = (params.page - 1) * params.limit;

  return params;
};
