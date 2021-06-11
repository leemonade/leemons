const validateLocale = require('../../../validations/locale');
const throwInvalid = require('../../../validations/throwInvalid');

const localesTable = leemons.query('plugins_multilanguage::locales');

/**
 * Deletes the locale that matches the code
 * @param {string} code The locale iso code xx-YY or xx
 * @returns {Promise<Boolean>} if the locale was deleted or not
 */
async function deleteOne(code) {
  const _code = code.toLowerCase();

  throwInvalid(validateLocale(_code));

  try {
    return (await localesTable.deleteMany({ code: _code })).count === 1;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the locale');
  }
}

/**
 * Deletes the locales that matches the codes
 * @param {string[]} codes The locale iso code xx-YY or xx
 * @returns {Promise<Number>} The number of locales deleted
 */
async function deleteMany(codes) {
  // Todo: Add validation (fails when codes is not an array)
  const _codes = codes.map((code) => code.toLowerCase());
  throwInvalid(_codes.map((code) => validateLocale(code)));

  try {
    return (await localesTable.deleteMany({ code_$in: _codes })).count;
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while deleting the locales');
  }
}

module.exports = {
  delete: deleteOne,
  deleteMany,
};
