const { validateLocale, validateLocalesArray } = require('../../validations/locale');
const { has: hasLocale, hasMany: hasLocales } = require('./has');

const localesTable = leemons.query('plugins_multilanguage::locales');

/**
 * Adds one locale to the database if it does not exist
 *
 * @param {LocaleCode} code The locale iso code xx-YY or xx
 * @param {LocaleName} name The display name of the given locale
 *
 * @returns {Promise<Locale | null>} null if the locale already exists and the locale object if created
 */
async function add(code, name) {
  // Validate the locale and get the code in lowercase
  const locale = validateLocale({ code, name });

  try {
    // If the locale does not exist, create it
    if (!(await hasLocale(locale.code))) {
      const dbLocale = await localesTable.create(locale);

      leemons.log.info(`New locale added: ${dbLocale.code} | ${dbLocale.name}`);

      return dbLocale;
    }
    // If already exists, return null
    return null;
  } catch (e) {
    leemons.log.error(e.message);
    throw new Error('An error occurred while creating the locale');
  }
}

/**
 * Adds many locales to the database. Only adds those not existing
 *
 * @param {Array<Array<LocaleCode, LocaleName>>} locales An array of locales ([code, name])
 *
 * @returns {Promise<Locale[]>} if all the locales already exists and an array of locale objects created
 *
 * @example
 * addMany([
 *  ['es-ES', 'Español de España'],
 *  ['en-US', 'English of the United States'],
 * ]);
 */
async function addMany(locales) {
  // Validate the locales and get an array of Locale objects
  const _locales = validateLocalesArray(locales);

  const codes = _locales.map((locale) => locale.code);

  // Check for duplicated codes
  if (codes.length > [...new Set(codes)].length) {
    throw new Error('The inserted locale codes should be unique');
  }

  try {
    return await localesTable.transaction(async (t) => {
      // Check which of the provided locales exists
      const existingLocales = await hasLocales(codes);

      // Get the locales not present in the database
      const newLocales = _locales.filter((locale) => !existingLocales[locale.code]);

      // If not newLocales, return an empty array
      if (newLocales.length === 0) {
        return [];
      }

      // Return the new locales
      const addedLocales = await localesTable.createMany(newLocales, { transacting: t });
      leemons.log.info(
        `New locales added: ${newLocales
          .map((locale) => `${locale.code} | ${locale.name}`)
          .join(', ')}`
      );
      return addedLocales;
    });
  } catch (e) {
    leemons.log.error(e.message);
    throw new Error('An error occurred while creating the locales');
  }
}

module.exports = { add, addMany };
