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
};
