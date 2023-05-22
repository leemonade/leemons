module.exports = {
  translations: () => {
    const multilanguage = leemons.getPlugin('multilanguage');
    if (multilanguage) {
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
};
