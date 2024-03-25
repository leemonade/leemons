const { sha1 } = require('object-hash');

/**
 * Generates a hash for each locale's localizations.
 *
 * This function takes an object containing localizations for different locales,
 * computes a SHA1 hash for the localizations of each locale, and returns an object
 * mapping each locale to its corresponding hash.
 *
 * @param {Object} params - The parameters for the function.
 * @param {{[locale: string]: any}} params.localizations - The localizations to hash, keyed by locale.
 * @returns {{[locale: string]: string}} An object mapping each locale to the hash of its localizations.
 */

function getLocalizationHashByLocale({ localizations }) {
  const locales = Object.keys(localizations);

  const hashPerLocale = {};

  locales.map(async (locale) => {
    hashPerLocale[locale] = sha1(localizations[locale]);
  });

  return hashPerLocale;
}

module.exports = { getLocalizationHashByLocale };
