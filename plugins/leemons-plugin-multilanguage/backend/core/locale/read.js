const _ = require('lodash');
const { validateLocaleCode, validateLocaleCodeArray } = require('../../validations/locale');

module.exports = (Base) =>
  class LocaleGet extends Base {
    /**
     * Gets the given locale info from the database
     * @param {LocaleCode} code The locale iso code xx-YY or xx
     * @returns {Promise<Locale | null>} The locale
     */
    async get(code, { transacting } = {}) {
      // Validates the code and returns it lowercased
      const _code = validateLocaleCode(code);

      try {
        return await this.model.findOne({ code: _code }, { transacting });
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
    async getMany(codes, { transacting } = {}) {
      // Validates the codes and returns them lowercased
      const _codes = validateLocaleCodeArray(codes);

      try {
        return await this.model.find({ code_$in: _codes }, { transacting });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the locales');
      }
    }

    /**
     * Gets all the existing locales in the database
     * @returns {Promise<Locale[]>} An array with all the locales in the database
     */
    async getAll({ transacting } = {}) {
      try {
        return await this.model.find({ code_$null: false }, { transacting });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting all the locales');
      }
    }

    /**
     * Returns an array of locations in order of importance.
     * Your specific locales -> User locale -> Center locale -> Platform locale
     * @returns {Promise<string[]>} Locale array
     */
    async resolveLocales(userSession, locales, { transacting } = {}) {
      let finalLocales = [];
      // Your specific locales
      if (locales) {
        finalLocales = finalLocales.concat(locales);
      }
      if (userSession) {
        // User locale
        if (userSession.locale) finalLocales.push(userSession.locale);
        // Center locale
        if (userSession.userAgents) {
          const centers = await leemons
            .getPlugin('users')
            .services.users.getUserAgentCenter(userSession.userAgents, { transacting });
          _.forEach(centers, ({ locale }) => {
            finalLocales.push(locale);
          });
        }
      }
      // Platform locale
      const platformLocale = await leemons
        .getPlugin('users')
        .services.platform.getDefaultLocale({ transacting });
      if (platformLocale) {
        finalLocales.push(platformLocale);
      }

      return _.uniq(finalLocales);
    }
  };
