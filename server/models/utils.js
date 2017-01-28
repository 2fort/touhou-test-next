const _ = require('lodash');

this.noUnderscoreDangle = function noUnderscoreDangle(doc, ret) {
  const exp = Object.assign({}, ret);
  delete exp._id;
  delete exp.__v;
  return exp;
};

this.makeSlug = function makeSlug(title) {
  return _.snakeCase(title);
};
