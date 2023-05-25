const LocaleAdd = require('./create');
const LocaleGet = require('./read');
const LocaleSet = require('./update');
const LocaleDelete = require('./delete');
const LocaleHas = require('./has');

module.exports = {
  ...LocaleAdd,
  ...LocaleGet,
  ...LocaleSet,
  ...LocaleDelete,
  ...LocaleHas,
};
