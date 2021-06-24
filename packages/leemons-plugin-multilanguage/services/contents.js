const LocalizationProvider = require('../src/services/localization');

const model = leemons.query('plugins_multilanguage::contents');

module.exports = {
  // Needs to be a function due to this
  getProvider() {
    const provider = new LocalizationProvider({
      model,
      caller: this.calledFrom,
      private: true,
    });

    // Prevent the modification of the provider, so the caller can't be modified
    Object.seal(provider);

    return provider;
  },
};
