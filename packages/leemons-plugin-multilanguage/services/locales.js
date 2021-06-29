const LocalesProvider = require('../src/services/locale');
const { isValidLocaleCode } = require('../src/validations/locale');

const model = leemons.query('plugins_multilanguage::locales');

module.exports = {
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
