const _ = require('lodash');

const { withTransaction } = global.utils;

// A mixing for extending all the needed classes
module.exports = (Base) =>
  class LocalizationHas extends Base {
    /**
     * Checks if the given localization tuple exists
     * @param {LocalizationKey} key The localization key
     * @param {LocaleCode} locale The desired locale
     * @returns {Promise<boolean>} if the localization exists
     */
    async has(key, locale, { transacting } = {}) {
      const tuple = this.validator.validateLocalizationTuple({ key, locale }, this.private);

      try {
        return (await this.model.count(tuple, { transacting })) === 1;
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while checking if the localization exists');
      }
    }

    /**
     * Checks if the given localizations exists
     * @param {Array<LocalizationKey, LocaleCode>[]} localizations An array of localization objects
     * @returns {Promise<{[locale:string]: {[key:string]:boolean}}>} An array with the localizations that exists
     */
    async hasMany(localizations, { transacting } = {}) {
      // Validates the localizations and lowercase each tuple
      const _localizations = this.validator.validateLocalizationTupleArray(
        localizations,
        this.private
      );

      try {
        return await withTransaction(
          async (t) => {
            const existingLocalizations = await this.model.find(
              { $or: _localizations },
              { columns: ['id', 'key', 'locale'] },
              { transacting: t }
            );

            const result = {};

            _localizations.forEach((localization) => {
              // Find if the given tuple exists in the database
              const exists =
                existingLocalizations.findIndex(
                  (existingLocalization) =>
                    existingLocalization.key === localization.key &&
                    existingLocalization.locale === localization.locale
                ) !== -1;

              if (!_.has(result, localization.locale)) {
                _.set(result, `${localization.locale}`, {});
              }

              // Set the key in a json like:
              // { [locale]: { [key]: boolean } }
              result[localization.locale][localization.key] = exists;
            });

            return result;
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
