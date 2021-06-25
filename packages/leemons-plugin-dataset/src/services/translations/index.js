module.exports = {
  translations: () => {
    if (leemons.plugins.multilanguage) {
      return {
        common: leemons.plugins.multilanguage.services.common.getProvider(),
        contents: leemons.plugins.multilanguage.services.contents.getProvider(),
        locales: leemons.plugins.multilanguage.services.locales.getProvider(),
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
