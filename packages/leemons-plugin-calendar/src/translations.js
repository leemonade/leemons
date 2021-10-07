module.exports = {
  translations: () => {
    const multilanguage = leemons.getPlugin('multilanguage');
    if (multilanguage) {
      return {
        common: multilanguage.services.common.getProvider(),
        contents: multilanguage.services.contents.getProvider(),
        locales: multilanguage.services.locales.getProvider(),
        functions: {
          isValidLocaleCode: leemons.getPlugin('multilanguage').services.locales.isValidLocaleCode,
          localeRegex: leemons.getPlugin('multilanguage').services.locales.localeRegex,
          localeRegexString: leemons.getPlugin('multilanguage').services.locales.localeRegexString,
        },
      };
    }
    return null;
  },
};
