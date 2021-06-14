const localizationsTable = leemons.query('plugins_multilanguage::localizations');

/**
 * Deletes the localization that matches the tuple key, locale
 * @param {string} key the entry key
 * @param {string} locale the locale code
 * @returns {Promise<Boolean>} if the locale was deleted or not
 */
async function deleteOne(key, locale) {
  const _key = key.toLowerCase();
  const _locale = locale.toLowerCase();

  try {
    return (await localizationsTable.deleteMany({ key: _key, locale: _locale })).count === 1;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the localization');
  }
}

/**
 * Deletes the localization that matches the key prefix
 *
 * If not locale provided, remove all the keys matching the prefix in any locale
 *
 * @param {string} key The key prefix
 * @param {string} [locale] the locale code
 * @returns {Promise<Boolean>} if the locale was deleted or not
 */
async function deleteKeyStartsWith(key, locale = null) {
  const query = {
    key_$startsWith: key.toLowerCase(),
  };

  if (locale) {
    query.locale = locale.toLowerCase();
  }

  try {
    return (await localizationsTable.deleteMany(query)).count;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the localizations');
  }
}

/**
 * Deletes the localization that matches the tuple key, locale
 * @param {string[][]} localizations An array of [key, locale]
 * @returns {Promise<Number>} The number of localizations deleted
 */
async function deleteMany(localizations) {
  // Todo: Add validation (fails when codes is not an array)
  const _localizations = localizations.map(([key, locale]) => ({
    key: key.toLowerCase(),
    locale: locale.toLowerCase(),
  }));

  try {
    return (await localizationsTable.deleteMany({ $or: _localizations })).count;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the localizations');
  }
}

async function deleteAll({ key = null, locale = null }) {
  const query = {};

  if (key) {
    query.key = key;
  }
  if (locale) {
    query.locale = locale;
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
