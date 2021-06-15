const validateLocale = require('../../../validations/locale');
const validateDataType = require('../../../validations/datatypes');
const throwInvalid = require('../../../validations/throwInvalid');

const localesTable = leemons.query('plugins_multilanguage::locales');

/**
 * Sets the given name to the locale that matches the code
 * If not locale exists with such code, it returns null
 * @param {string} code The locale iso code xx-YY or xx
 * @param {string} name The display name of the given locale
 * @returns {Promise<Locale> | Promise<null>} null if the locale doesn't exist and the locale object if updated
 */
async function setName(code, name) {
  const _code = code.toLowerCase();

  throwInvalid(validateLocale(_code));
  throwInvalid(validateDataType(name, { type: 'string', minLength: 1, maxlength: 255 }));

  try {
    return await localesTable.set({ code: _code }, { name });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while updating the locale');
  }
}

module.exports = {
  setName,
};
