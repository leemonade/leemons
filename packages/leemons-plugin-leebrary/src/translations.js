module.exports = {
  translations: () => {
    const { services } = leemons.getPlugin('multilanguage');

    if (services) {
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
