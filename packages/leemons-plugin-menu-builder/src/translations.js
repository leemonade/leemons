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
};
