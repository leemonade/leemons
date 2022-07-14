const platform = require('../src/services/platform');

module.exports = {
  setHostname: platform.setHostname,
  getHostname: platform.getHostname,
  setEmail: platform.setEmail,
  getEmail: platform.getEmail,
  setDefaultLocale: platform.setDefaultLocale,
  getDefaultLocale: platform.getDefaultLocale,
  addLocale: platform.addLocale,
  getLocales: platform.getLocales,
};
