const constants = require('../config/constants');

module.exports = {
  translations: () => {
    const multilanguage = leemons.getPlugin('multilanguage');
    if (multilanguage && multilanguage.services) {
      const { services } = multilanguage;
      return {
        common: services.common.getProvider(),
        contents: services.contents.getProvider(),
        locales: services.locales.getProvider(),
        functions: {
          isValidLocaleCode: services.locales.isValidLocaleCode,
          localeRegex: services.locales.localeRegex,
          localeRegexString: services.locales.localeRegexString,
        },
      };
    }
    return null;
  },
  /**
   * Return the key for translation
   * @public
   * @static
   * @param {string} locationName - Location name
   * @param {string} pluginName - Plugin name
   * @param {string=} key - Another key like description or my-property-to-translate
   * @return {string}
   * */
  getTranslationKey: (locationName, pluginName, key) => {
    const _pluginName = constants.pluginName;
    if (key) return `${_pluginName}.${locationName}.${pluginName}.${key}`;
    return `${_pluginName}.${locationName}.${pluginName}`;
  },
};
