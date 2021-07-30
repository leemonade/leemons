module.exports = {
  translations: () => {
    if (leemons.getPlugin('multilanguage')) {
      return {
        common: leemons.getPlugin('multilanguage').services.common.getProvider(),
        contents: leemons.getPlugin('multilanguage').services.contents.getProvider(),
        locales: leemons.getPlugin('multilanguage').services.locales.getProvider(),
        functions: {
          isValidLocaleCode: leemons.getPlugin('multilanguage').services.locales.isValidLocaleCode,
          localeRegex: leemons.getPlugin('multilanguage').services.locales.localeRegex,
          localeRegexString: leemons.getPlugin('multilanguage').services.locales.localeRegexString,
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
    const _pluginName = 'plugins.dataset';
    if (key) return `${_pluginName}.${locationName}.${pluginName}.${key}`;
    return `${_pluginName}.${locationName}.${pluginName}`;
  },
};
