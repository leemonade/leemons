const { validateLocaleCode, validateLocaleCodeArray } = require('../../validations/locale');

module.exports = (Base) =>
  class LocaleGet extends Base {
    /**
     * Gets the given locale info from the database
     * @param {LocaleCode} code The locale iso code xx-YY or xx
     * @returns {Promise<Locale | null>} The locale
     */
    async get(code) {
      // Validates the code and returns it lowercased
      const _code = validateLocaleCode(code);

      try {
        return await this.model.findOne({ code: _code });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the locale');
      }
    }

    /**
     * Gets the given locales form the database
     * @param {LocaleCode[]} codes The locale iso code xx-YY or xx
     * @returns {Promise<Locale[]>} An array with the locales that exists
     */
    async getMany(codes) {
      // Validates the codes and returns them lowercased
      const _codes = validateLocaleCodeArray(codes);

      try {
        return await this.model.find({ code_$in: _codes });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the locales');
      }
    }

    /**
     * Gets all the existing locales in the database
     * @returns {Promise<Locale[]>} An array with all the locales in the database
     */
    async getAll() {
      try {
        return await this.model.find({ code_$null: false });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting all the locales');
      }
    }
  };
