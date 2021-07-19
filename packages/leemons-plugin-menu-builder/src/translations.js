module.exports = {
  translations: () => {
    if (leemons.plugins.multilanguage) {
      return {
        common: leemons.plugins.multilanguage.services.common.getProvider(),
        contents: leemons.plugins.multilanguage.services.contents.getProvider(),
        locales: leemons.plugins.multilanguage.services.locales.getProvider(),
        functions: {
          isValidLocaleCode: leemons.plugins.multilanguage.services.locales.isValidLocaleCode,
          localeRegex: leemons.plugins.multilanguage.services.locales.localeRegex,
          localeRegexString: leemons.plugins.multilanguage.services.locales.localeRegexString,
        },
      };
    }
    return null;
  },
};
