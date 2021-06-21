const { validateLocaleCode } = require('../../validations/locale');
const {
  validateLocalizationTuple,
  validateLocalizationKey,
  validateLocalizationTupleArray,
} = require('../../validations/localization');

const localizationsTable = leemons.query('plugins_multilanguage::localizations');

/**
 * Deletes the localization that matches the tuple [key, locale]
 * @param {LocalizationKey} key the entry key
 * @param {LocaleCode} locale the locale code
 * @returns {Promise<boolean>} if the locale was deleted or not
 */
async function deleteOne(key, locale) {
  const tuple = validateLocalizationTuple({ key, locale });

  try {
    // Delete the given tuple
    return (await localizationsTable.deleteMany(tuple)).count === 1;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the localization');
  }
}

/**
 * Deletes the localizations that matches the key prefix
 *
 * If not locale provided, remove all the keys matching the prefix in any locale
 *
 * @param {LocalizationKey} key The key prefix
 * @param {LocaleCode} [locale] the locale code
 * @returns {Promise<number>} how many localizations where deleted
 */
async function deleteKeyStartsWith(key, locale = null) {
  console.log(key);
  const query = {
    // Validate key and get it lowercased
    key_$startsWith: validateLocalizationKey(key),
  };

  if (locale) {
    // Validate locales and get it lowercased
    query.locale = validateLocaleCode(locale);
  }

  try {
    return (await localizationsTable.deleteMany(query)).count;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the localizations');
  }
}

/**
 * Deletes the localizations that matches the tuple [key, locale]
 * @param {Array<LocalizationKey, LocaleCode>[]} localizations An array of [key, locale]
 * @returns {Promise<Number>} The number of localizations deleted
 */
async function deleteMany(localizations) {
  // Validates the input and returns an array of LocalizationTuples ([{key, locale}])
  const _localizations = validateLocalizationTupleArray(localizations);

  try {
    return (await localizationsTable.deleteMany({ $or: _localizations })).count;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the localizations');
  }
}

/**
 * Deletes all the entries mathching a key or locale
 * @param {object} params
 * @param {LocalizationKey} [params.key] The key to delete
 * @param {LocaleCode} [params.locale] The locale to delete
 * @returns {number} the number of items deleted
 */
async function deleteAll({ key = null, locale = null }) {
  const query = {};

  if (key) {
    query.key = validateLocalizationKey(key);
  }
  if (locale) {
    query.locale = validateLocaleCode(locale);
  }

  if (!query.key && !query.locale) {
    throw new Error('At least one parameter should be provided');
  }

  try {
    return (await localizationsTable.deleteMany(query)).count;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the localizations');
  }
}

module.exports = {
  delete: deleteOne,
  deleteMany,
  deleteAll,
  deleteKeyStartsWith,
};
