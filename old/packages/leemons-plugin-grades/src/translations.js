module.exports = {
  translations: () => {
    const multilanguage = leemons.getPlugin('multilanguage');
    if (multilanguage && multilanguage.services) {
      const { services } = multilanguage;
      return {
        common: services.common.getProvider(),
        contents: services.contents.getProvider(),
        locales: services.locales.getProvider(),
      };
    }
    return null;
  },
};
