const validateLocale = require('../../../validations/locale');
const validateDataType = require('../../../validations/datatypes');
const throwInvalid = require('../../../validations/throwInvalid');

const localesTable = leemons.query('plugins_multilanguage::locales');

/**
 * Adds one locale
 * @param {string} code The locale iso code xx-YY or xx
 * @param {string} name The display name of the given locale
 * @returns {Promise<Locale> | Promise<null>} null if the locale already exists and the locale object if created
 * @param
 */
async function add(code, name) {
  const _code = code.toLowerCase();

  throwInvalid(validateLocale(_code));
  throwInvalid(validateDataType(name, { type: 'string', minLength: 1, maxlength: 255 }));

  try {
    if ((await localesTable.count({ code: _code })) === 0) {
      const locale = await localesTable.create({ code: _code, name });
      return locale;
    }
    return null;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while creating the locale');
  }
}

/**
 * Adds many locales
 * @param {string[][]} locales An array of locales
 * @returns {Promise<Locale[]> | Promise<[]>} [] if all the locales already exists and an array of locale objects created
 * @example
 * addMany([
 *  ['es-ES', 'Español de España'],
 *  ['en-US', 'English of the United States'],
 * ]);
 */
async function addMany(locales) {
  // TODO: Add validation (fails when locales is not an array)
  const _locales = locales.map(([code, name]) => ({
    code: code.toLowerCase(),
    name,
  }));
  throwInvalid(
    _locales.map((locale) => [
      validateLocale(locale.code),
      validateDataType(locale.name, { type: 'string', minLength: 1, maxLength: 255 }),
    ])
  );

  const codes = _locales.map((locale) => locale.code);

  if (codes.length > [...new Set(codes)].length) {
    throw new Error('The inserted locales codes should be unique');
  }

  try {
    return await localesTable.transaction(async (t) => {
      // Get an array of existing locale codes (only those included in the addMany argument)
      const existingLocales = await localesTable
        .find(
          {
            code_$in: codes,
          },
          { columns: ['code'], transacting: t }
        )
        .map((locale) => locale.code);

      // Get the locales not present in the database
      const newLocales = _locales.filter((locale) => !existingLocales.includes(locale.code));

      // If not newLocales, return an empty array
      if (newLocales.length === 0) {
        return [];
      }

      // Return the new locales
      return localesTable.createMany(newLocales, { transacting: t });
    });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while creating the locales');
  }
}

module.exports = { add, addMany };
