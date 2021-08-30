const platform = require('../src/services/platform');

module.exports = {
  setDefaultLocale: platform.setDefaultLocale,
  getDefaultLocale: platform.getDefaultLocale,
  addLocale: platform.addLocale,
  getLocales: platform.getLocales,
};
