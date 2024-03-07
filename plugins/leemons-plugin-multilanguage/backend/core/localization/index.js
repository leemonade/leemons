const LocalizationCount = require('./count');
const LocalizationAdd = require('./create');
const LocalizationGet = require('./read');
const LocalizationSet = require('./update');
const LocalizationDelete = require('./delete');
const LocalizationHas = require('./has');

module.exports = {
  ...LocalizationCount,
  ...LocalizationAdd,
  ...LocalizationGet,
  ...LocalizationSet,
  ...LocalizationDelete,
  ...LocalizationHas,
};
