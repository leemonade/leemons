const _ = require('lodash');
const validateLocale = require('../../../validations/locale');
const throwInvalid = require('../../../validations/throwInvalid');

const localesTable = leemons.query('plugins_multilanguage::locales');

/**
 * Checks if the given locale exists
 * @param {string} code The locale iso code xx-YY or xx
 * @returns {Promise<Boolean>} if the locale exists
 */
async function has(code) {
  const _code = code.toLowerCase();

  throwInvalid(validateLocale(_code));

  try {
    return (await localesTable.count({ code: _code })) === 1;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while creating the locale');
  }
}

/**
 * Checks if the given locales exists
 * @param {string[]} codes The locale iso code xx-YY or xx
 * @returns {Promise<object>} An array with the locales that exists
 */
async function hasMany(codes) {
  // Todo: Add validation (fails when codes is not an array)
  const _codes = codes.map((code) => code.toLowerCase());
  throwInvalid(_codes.map((code) => validateLocale(code)));

  try {
    let existingLocales = await localesTable.find({ code_$in: _codes }, { columns: ['code'] });
    existingLocales = existingLocales.map((locale) => locale.code);

    return _.fromPairs(_codes.map((code) => [code, existingLocales.includes(code)]));
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the locales');
  }
}

module.exports = {
  has,
  hasMany,
};
