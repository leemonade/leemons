const { validateLocale } = require('../../validations/locale');

module.exports = (Base) =>
  class LocaleSet extends Base {
    /**
     * Sets the given name to the locale that matches the code
     * If not locale exists with such code, it returns null
     * @param {LocaleCode} code The locale iso code xx-YY or xx
     * @param {LocaleName} name The display name of the given locale
     * @returns {Promise<Locale | null>} null if the locale doesn't exist and the locale object if updated
     */
    async setName(code, name, { transacting } = {}) {
      // Validates the locale and returns it with the codes lowercased
      const _code = validateLocale({ code, name }).code;

      try {
        return await this.model.set({ code: _code }, { name }, { transacting });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while setting the locale');
      }
    }
  };
