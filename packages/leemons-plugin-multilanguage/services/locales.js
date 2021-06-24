const LocalesProvider = require('../src/services/locale');

const model = leemons.query('plugins_multilanguage::locales');

module.exports = {
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
