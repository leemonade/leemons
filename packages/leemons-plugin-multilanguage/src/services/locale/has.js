const _ = require('lodash');
const { validateLocaleCode, validateLocaleCodeArray } = require('../../validations/locale');

const { withTransaction } = global.utils;

module.exports = (Base) =>
  class LocaleHas extends Base {
    /**
     * Checks if the given locale exists
     * @param {LocaleCode} code The locale iso code xx-YY or xx
     * @returns {Promise<boolean>} if the locale exists
     */
    async has(code, { transacting } = {}) {
      // Validates the code and returns it in lowercase
      const _code = validateLocaleCode(code);

      try {
        return (await this.model.count({ code: _code }, { transacting })) > 0;
        // Get if there is at least 1 locale with the given code
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while creating the locale');
      }
    }

    /**
     * Checks if the given locales exists
     * @param {LocaleCode[]} codes The locale iso code xx-YY or xx
     * @returns {Promise<Object<string, boolean>>} An array with the locales that exists
     */
    async hasMany(codes, { transacting } = {}) {
      // Validates the code and returns them lowercased
      const _codes = validateLocaleCodeArray(codes);

      try {
        // Find the locales that exists in the database
        return await withTransaction(
          async (t) => {
            let existingLocales = await this.model.find(
              { code_$in: _codes },
              { columns: ['id', 'code'] },
              { transacting: t }
            );
            existingLocales = existingLocales.map((locale) => locale.code);

            // Generate an object of {locale: boolean}
            const result = _.fromPairs(
              _codes.map((code) => [code, existingLocales.includes(code)])
            );

            return { ...result };
          },
          this.model,
          transacting
        );
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while deleting the locales');
      }
    }
  };
