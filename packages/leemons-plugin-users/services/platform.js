const platform = require('../src/services/platform');

module.exports = {
  setEmail: platform.setEmail,
  getEmail: platform.getEmail,
  setDefaultLocale: platform.setDefaultLocale,
  getDefaultLocale: platform.getDefaultLocale,
  addLocale: platform.addLocale,
  getLocales: platform.getLocales,
};
