module.exports = {
  translations: () => {
    const multilanguage = leemons.getPlugin('multilanguage');
    if (multilanguage) {
      return {
        common: multilanguage.services.common.getProvider(),
        contents: multilanguage.services.contents.getProvider(),
        locales: multilanguage.services.locales.getProvider(),
      };
    }
    return null;
  },
};
