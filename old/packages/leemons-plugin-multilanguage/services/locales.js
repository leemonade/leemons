const LocalesProvider = require('../src/services/locale');
const { isValidLocaleCode, localeRegex, localeRegexString } = require('../src/validations/locale');

const model = leemons.query('plugins_multilanguage::locales');

module.exports = {
  localeRegex,
  localeRegexString,
  isValidLocaleCode,
  // Needs to be a function due to this
  getProvider() {
    const provider = new LocalesProvider({
      model,
      caller: this.calledFrom,
    });

    // Prevent the modification of the provider, so the caller can't be modified
    Object.seal(provider);

    return provider;
  },
};
