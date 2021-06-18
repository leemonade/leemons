const { validateLocale } = require('../../validations/locale');

const localesTable = leemons.query('plugins_multilanguage::locales');

/**
 * Sets the given name to the locale that matches the code
 * If not locale exists with such code, it returns null
 * @param {LocaleCode} code The locale iso code xx-YY or xx
 * @param {LocaleName} name The display name of the given locale
 * @returns {Promise<Locale | null>} null if the locale doesn't exist and the locale object if updated
 */
async function setName(code, name) {
  // Validates the locale and returns it with the codes lowercased
  const _code = validateLocale({ code, name }).code;

  try {
    return await localesTable.set({ code: _code }, { name });
  } catch (e) {
    leemons.log.debug(e.message);
    throw new Error('An error occurred while setting the locale');
  }
}

module.exports = {
  setName,
};
