const { validateLocaleCode, validateLocaleCodeArray } = require('../../validations/locale');

module.exports = (Base) =>
  class LocaleDelete extends Base {
    /**
     * Deletes the locale that matches the code
     * @param {string} code The locale iso code xx-YY or xx
     * @returns {Promise<Boolean>} if the locale was deleted or not
     */
    async delete(code, { transacting } = {}) {
      // Validates the code and returns it in lowercase
      const _code = validateLocaleCode(code);

      try {
        return (
          (await this.model.deleteMany({ code: _code, $limit: 1 }, { transacting })).count === 1
        );
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while deleting the locale');
      }
    }

    /**
     * Deletes the locales that matches the codes array
     * @param {string[]} codes An array of the locales iso codes xx-YY or xx
     * @returns {Promise<Number>} The number of locales deleted
     */
    async deleteMany(codes, { transacting } = {}) {
      // Validates the codes and returns them in lowercase
      const _codes = validateLocaleCodeArray(codes);

      try {
        return (await this.model.deleteMany({ code_$in: _codes }, { transacting })).count;

        // Delete the given codes an return the deleted count
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while deleting the locales');
      }
    }
  };
