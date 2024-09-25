const { addLocales } = require('./addLocales');
const { addLocalesDeploy } = require('./addLocalesDeploy');
const { getAddCustomTranslationKeysAction } = require('./getAddCustomTranslationKeysAction');
const { getTranslationKey } = require('./getTranslationKey');
const LeemonsMultilanguageMixin = require('./mixin/mixin');

module.exports = {
  addLocales,
  addLocalesDeploy,
  getTranslationKey,
  LeemonsMultilanguageMixin,
  getAddCustomTranslationKeysAction,
};
