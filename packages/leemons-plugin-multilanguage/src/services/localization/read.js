const _ = require('lodash');
const { validateLocaleCode } = require('../../validations/locale');

const { withTransaction } = global.utils;

// A mixing for extending all the needed classes
module.exports = (Base) =>
  class LocalizationGet extends Base {
    mergeTranslations(translations) {
      const keys = [];
      const result = [];
      _.forEach(translations, (items) => {
        _.forEach(items, (item) => {
          if (keys.indexOf(item.key) < 0) {
            keys.push(item.key);
            result.push(item);
          }
        });
      });
      return result;
    }

    /**
     * Gets the given localization
     * @param {LocalizationKey} key The localization key
     * @param {LocaleCode} locale The locale iso code xx-YY or xx
     * @returns {Promise<Localization | null>} The requested localization or null
     */
    async get(key, locale, { transacting } = {}) {
      const locales = _.isArray(locale) ? locale : [locale];
      // Validates the tuple and lowercase it
      const tuple = this.validator.validateLocalizationTuple({ key, locales }, this.private);

      try {
        const response = await this.model.find(
          {
            key: tuple.key,
            locale_$in: tuple.locales,
          },
          { transacting }
        );
        const responseByLocale = _.keyBy(response, 'locale');
        let result = null;
        _.forEach(locales, (l) => {
          if (responseByLocale[l]) {
            result = responseByLocale[l];
            return false;
          }
        });
        return result;
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localization');
      }
    }

    /**
     * Gets the given localization value
     * @param {LocalizationKey} key The localization key
     * @param {LocaleCode} code The locale iso code xx-YY or xx
     * @returns {Promise<LocalizationValue | null>} The requested localization value or null
     */
    async getValue(key, locale, { transacting } = {}) {
      const localization = await this.get(key, locale, { transacting });

      if (localization) {
        return localization.value;
      }
      return null;
    }

    /**
     * Gets many localization that matches the keys
     * @param {LocalizationKey[]} keys
     * @returns {Localization[]}
     */
    async getManyWithKeys(keys, { transacting } = {}) {
      // Validate keys array and lowercase them
      const _keys = this.validator.validateLocalizationKeyArray(keys, this.private);

      try {
        return await withTransaction(
          async (t) => {
            const foundLocalizations = await this.model.find(
              { key_$in: _keys },
              { transacting: t }
            );

            const localizationsByKey = _.groupBy(foundLocalizations, 'key');

            return Object.keys(localizationsByKey).reduce((acc, key) => {
              acc[key] = {};
              _.forEach(localizationsByKey[key], ({ locale, value }) => {
                acc[key][locale] = value;
              });
              return acc;
            }, {});
          },
          this.model,
          transacting
        );
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error ocurred while getting the localizations');
      }
    }

    /**
     * Gets many localization that matches the keys and the locale
     * @param {LocalizationKey[]} keys
     * @param {LocaleCode} locale
     * @returns {Localization[]}
     */
    async getManyWithLocale(keys, locale, { transacting } = {}) {
      const locales = _.isArray(locale) ? locale : [locale];
      // Validate keys array and lowercase them
      const _keys = this.validator.validateLocalizationKeyArray(keys, this.private);
      // Validate locale and lowercase it
      const _locales = _.map(locales, (locale) => validateLocaleCode(locale));

      try {
        return await withTransaction(
          async (t) => {
            const responses = await Promise.all(
              _.map(_locales, (locale) =>
                this.model.find({ key_$in: _keys, locale }, { transacting: t })
              )
            );

            const foundLocalizations = this.mergeTranslations(responses);

            return _.fromPairs(
              foundLocalizations.map((localization) => [localization.key, localization.value])
            );
          },
          this.model,
          transacting
        );
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error ocurred while getting the localizations');
      }
    }

    /**
     * Get all the localizations matching a key (different locales)
     * @param {LocalizationKey} key
     * @returns {Localization[]}
     */
    async getWithKey(key, { transacting } = {}) {
      // Validate the key and lowercase it
      const _key = this.validator.validateLocalizationKey(key, this.private);

      try {
        return await this.model.find({ key: _key }, { transacting });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localizations');
      }
    }

    /**
     * Get all the localizations matching a key (different locales)
     * @param {LocalizationKey} key
     * @returns {{[locale: string]: LocalizationValue} | null}
     */
    getLocaleValueWithKey(key, { transacting } = {}) {
      return withTransaction(
        async (t) => {
          const localizations = await this.getWithKey(key, { transacting: t });

          // Return null if no localization is found
          return localizations.reduce((result, { locale, value }) => {
            const _result = result || {};

            _result[locale] = value;

            return _result;
          }, null);
        },
        this.model,
        transacting
      );
    }

    /**
     * Gets all the localizations mathching a locale (different keys)
     * @param {LocaleCode} locale
     * @returns {Localization[]}
     */
    async getWithLocale(locale, { transacting } = {}) {
      // Validate the locale and lowercase it
      const _locale = validateLocaleCode(locale);

      const query = {
        locale: _locale,
      };

      if (this.private) {
        query.key_$startsWith = this.caller;
      }

      try {
        return await this.model.find(query, { transacting });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localizations');
      }
    }

    /**
     * Gets an object with keys and values of all the keys in a locale
     * @param {LocaleCode} locale
     * @returns {{[key: string]: LocalizationValue} | null}
     */
    async getKeyValueWithLocale(locale, { transacting } = {}) {
      try {
        return await withTransaction(
          async (t) => {
            const localizations = await this.getWithLocale(locale, { transacting: t });

            // Return null if no localization is found
            return localizations.reduce((result, { key, value }) => {
              const _result = result || {};

              _result[key] = value;

              return _result;
            }, null);
          },
          this.model,
          transacting
        );
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localizations');
      }
    }

    /**
     * Gets all the keys for a locale starting with a prefix
     * @param {LocalizationKey} key
     * @param {LocaleCode|LocaleCode[]} locale
     * @returns {Localization[]}
     */
    async getKeyStartsWith(key, locale, { transacting } = {}) {
      const locales = _.isArray(locale) ? locale : [locale];
      // Validate the tuple and lowercase it
      const tuple = this.validator.validateLocalizationTuple({ key, locales }, this.private);

      try {
        const responses = await Promise.all(
          _.map(tuple.locales, (locale) =>
            this.model.find({ key_$startsWith: tuple.key, locale }, { transacting })
          )
        );
        return this.mergeTranslations(responses);
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localization');
      }
    }

    /**
     * Gets an object of key value for all the keys starting with a prefix for a given locale
     * @param {LocalizationKey} key
     * @param {LocaleCode} locale
     * @returns {{[key: string]: LocalizationValue} | null}
     */
    async getKeyValueStartsWith(key, locale, { transacting } = {}) {
      try {
        return await withTransaction(
          async (t) => {
            const localizations = await this.getKeyStartsWith(key, locale, { transacting: t });

            // Return null if no localization is found
            return localizations.reduce((result, { key: lKey, value }) => {
              const _result = result || {};

              _result[lKey] = value;

              return _result;
            }, null);
          },
          this.model,
          transacting
        );
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localization');
      }
    }
  };
