const _ = require('lodash');
const validateLocale = require('../../../validations/locale');
const throwInvalid = require('../../../validations/throwInvalid');

const localesTable = leemons.query('plugins_multilanguage::locales');

/**
 * Gets the given locale
 * @param {string} code The locale iso code xx-YY or xx
 * @returns {Promise<Locale> | null} The locale
 */
async function get(code) {
  const _code = code.toLowerCase();

  throwInvalid(validateLocale(_code));

  try {
    return await localesTable.findOne({ code: _code });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while creating the locale');
  }
}

/**
 * Gets the given locales
 * @param {string[]} codes The locale iso code xx-YY or xx
 * @returns {Promise<Locale[]>} An array with the locales that exists
 */
async function getMany(codes) {
  // Todo: Add validation (fails when codes is not an array)
  const _codes = codes.map((code) => code.toLowerCase());
  throwInvalid(_codes.map((code) => validateLocale(code)));

  try {
    return await localesTable.find({ code_$in: _codes });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting the locales');
  }
}

async function getAll() {
  try {
    return await localesTable.find({ code_$ne: '' });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while getting all the locales');
  }
}

module.exports = {
  get,
  getMany,
  getAll,
};
