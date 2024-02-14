const { get } = require('lodash');
const { getHashKey } = require('./getHashKey');
const { HASH_DOCUMENT_KEY } = require('../constants');

/**
 * Checks if the hashes for the given locales are already saved in the database.
 * @param {Object} param0
 * @param {Object} param0.KeyValuesModel
 * @param {{[locale:string]: string}} param0.hashPerLocale
 * @returns {Promise<boolean>}
 */
async function areLocalesHashesSaved({ KeyValuesModel, hashPerLocale }) {
  const locales = Object.keys(hashPerLocale);
  const keys = locales.map((locale) => getHashKey({ locale, hash: hashPerLocale[locale] }));

  const hashesSaved =
    (await KeyValuesModel.findOne({
      key: HASH_DOCUMENT_KEY,
    })
      .select(keys)
      .lean()) ?? {};

  const localesSaved = {};

  locales.forEach((locale, i) => {
    localesSaved[locale] = get(hashesSaved, keys[i], false);
  });

  return localesSaved;
}

module.exports = { areLocalesHashesSaved };
