const { areLocalesHashesSaved } = require('./areLocalesHashesSaved');

/**
 * Determines which locales need to be loaded based on the provided hash per locale.
 * @param {Object} param0 The function parameters.
 * @param {{[locale: string]: string}} param0.hashPerLocale An object mapping each locale to its hash.
 * @param {Object} param0.KeyValuesModel The Mongoose model to interact with the key-values store.
 * @returns {Array<string>} An array of locale strings that need to be loaded.
 */
async function getLocalesToLoad({ hashPerLocale, KeyValuesModel }) {
  const localesSaved = await areLocalesHashesSaved({ KeyValuesModel, hashPerLocale });

  return Object.entries(localesSaved)
    .filter(([_, saved]) => !saved)
    .map(([locale]) => locale);
}

module.exports = { getLocalesToLoad };
