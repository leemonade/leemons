const LocaleAdd = require('./create');
const LocaleGet = require('./read');
const LocaleSet = require('./update');
const LocaleDelete = require('./delete');
const LocaleHas = require('./has');
const createMixin = require('../../helpers/createMixin');
const MultilanguageBase = require('../../helpers/MultilanguageBase');

const LocaleProvider = createMixin([
  MultilanguageBase,
  // LocaleHas must be the first one, because some other classes use its methods
  LocaleHas,
  LocaleAdd,
  LocaleGet,
  LocaleSet,
  LocaleDelete,
]);

module.exports = LocaleProvider;
