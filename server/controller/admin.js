const path = require('path');
const flatten = require('flat');
const ObjectId = require('mongodb').ObjectId;
const utils = require('../lib/utils');

this.dealWithFile = async function dealWithFile(file) {
  // if uploaded image has a .svg extension
  if (path.extname(file.filename) === '.svg') {
    // just copy it to COMPRESSED and THUMBNAIL folders
    await utils.copyOneToMany(process.env.UPLOAD_TEMP, file.filename, [
      process.env.IMG_COMPRESSED,
      process.env.IMG_THUMBNAIL,
    ]);
    // move uploaded file to IMG_ORIG folder
    await utils.moveFile(file.path, process.env.IMG_ORIG + file.filename);
  } else {
    await Promise.all([
      // generate compressed image
      utils.resizeWithSharp(file.path, file.filename, null, 768, process.env.IMG_COMPRESSED),
      // generate thumbnail image
      utils.resizeWithSharp(file.path, file.filename, 150, 150, process.env.IMG_THUMBNAIL),
    ]);
    // move uploaded file to IMG_ORIG folder
    await utils.moveFile(file.path, process.env.IMG_ORIG + file.filename);
  }
  return file.filename;
};

this.deleteAllImg = function deleteAllImg(image) {
  const paths = [
    process.env.IMG_ORIG + image,
    process.env.IMG_COMPRESSED + image,
    process.env.IMG_THUMBNAIL + image,
  ];
  return utils.deleteMany(paths);
};

function toObjectId(id) {
  const stringId = id.toString().toLowerCase();

  if (!ObjectId.isValid(stringId)) {
    return null;
  }

  const result = new ObjectId(stringId);

  if (result.toString() !== stringId) {
    return null;
  }

  return result;
}

this.queryParams = function queryParams(query, emptyStringToNull = []) {
  const params = {
    page: Number(query.page) || undefined,
    limit: Number(query.limit) || undefined,
    sort: query.sort,
    filter: query.filter || {},
  };

  if (Object.keys(params.filter)[0]) {
    params.filter = flatten(params.filter);
  }

  const cleanFilters = {};

  Object.keys(params.filter).forEach((key) => {
    if (params.filter[key] === '' && emptyStringToNull.includes(key)) {
      cleanFilters[key] = null;
      params.filter[key] = undefined;
    }

    // convert blank strings to { $exists: false }
    if (params.filter[key] === '') {
      cleanFilters[key] = { $in: [null, ''] };
      params.filter[key] = undefined;
    }

    // convert strings to Numbers if possible
    if (params.filter[key] && !isNaN(Number(params.filter[key]))) {
      cleanFilters[key] = Number(params.filter[key]);
      params.filter[key] = undefined;
    }

    // same with ObjectId
    if (params.filter[key] && toObjectId(params.filter[key])) {
      cleanFilters[key] = ObjectId(params.filter[key]);
      params.filter[key] = undefined;
    }

    // convert strings to regex for partial search
    if (params.filter[key] && typeof params.filter[key] === 'string') {
      cleanFilters[key] = new RegExp(params.filter[key], 'i');
      params.filter[key] = undefined;
    }
  });

  params.filter = cleanFilters;
  params.skip = (params.page && params.limit) ? (params.page - 1) * params.limit : undefined;

  return params;
};
