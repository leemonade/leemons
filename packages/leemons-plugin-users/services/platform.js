const platform = require('../src/services/platform');

module.exports = {
  setDomain: platform.setDomain,
  getDomain: platform.getDomain,
  setEmail: platform.setEmail,
  getEmail: platform.getEmail,
  setDefaultLocale: platform.setDefaultLocale,
  getDefaultLocale: platform.getDefaultLocale,
  addLocale: platform.addLocale,
  getLocales: platform.getLocales,
};
