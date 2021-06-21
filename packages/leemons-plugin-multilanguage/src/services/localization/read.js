const _ = require('lodash');
const { validateLocaleCode } = require('../../validations/locale');
const {
  validateLocalizationTuple,
  validateLocalizationKeyArray,
  validateLocalizationKey,
} = require('../../validations/localization');

// A mixing for extending all the needed classes
module.exports = (Base) =>
  class LocalizationGet extends Base {
    /**
     * Gets the given locale
     * @param {LocaleCode} code The locale iso code xx-YY or xx
     * @returns {Promise<Localization | null>} The requested localization or null
     */
    async get(key, locale) {
      // Validates the tuple and lowercase it
      const tuple = validateLocalizationTuple({ key, locale });

      try {
        return await this.model.findOne(tuple);
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localization');
      }
    }

    /**
     * Gets many localization that matches the keys and the locale
     * @param {LocalizationKey[]} keys
     * @param {LocaleCode} locale
     * @returns {Localization[]}
     */
    async getManyWithLocale(keys, locale) {
      // Validate keys array and lowercase them
      const _keys = validateLocalizationKeyArray(keys);
      // Validate locale and lowercase it
      const _locale = validateLocaleCode(locale);

      try {
        const foundLocalizations = await this.model.find({ key_$in: _keys, locale: _locale });

        return _.fromPairs(
          foundLocalizations.map((localization) => [localization.key, localization.value])
        );
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error ocurred while getting the localizations');
      }
    }

    /**
     * Get all the localization mathing a key (different locales)
     * @param {LocalizationKey} key
     * @returns {Localization[]}
     */
    async getWithKey(key) {
      // Validate the key and lowercase it
      const _key = validateLocalizationKey(key);

      try {
        return await this.model.find({ key: _key });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localizations');
      }
    }

    /**
     * Gets all the localizations mathching a locale (different keys)
     * @param {LocaleCode} locale
     * @returns {Localization[]}
     */
    async getWithLocale(locale) {
      // Validate the locale and lowercase it
      const _locale = validateLocaleCode(locale);

      try {
        return await this.model.find({ locale: _locale });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localizations');
      }
    }

    /**
     * Gets an object with keys and values of all the keys in a locale
     * @param {LocaleCode} locale
     * @returns {{[key: string]: LocalizationValue}}
     */
    async getKeyValueWithLocale(locale) {
      // Validate the locale and lowercase it
      const _locale = validateLocaleCode(locale);

      try {
        const localizations = await this.model.find({ locale: _locale });

        return localizations.reduce((result, { key, value }) => {
          const _result = result;

          _result[key] = value;

          return _result;
        }, {});
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localizations');
      }
    }

    /**
     * Gets all the keys for a locale starting with a prefix
     * @param {LocalizationKey} key
     * @param {LocaleCode} locale
     * @returns {Localization[]}
     */
    async getKeyStartsWith(key, locale) {
      // Validate the tuple and lowercase it
      const tuple = validateLocalizationTuple({ key, locale });

      try {
        return await this.model.find({ key_$startsWith: tuple.key, locale: tuple.locale });
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localization');
      }
    }

    /**
     * Gets an object of key value for all the keys starting with a prefix for a given locale
     * @param {LocalizationKey} key
     * @param {LocaleCode} locale
     * @returns {{[key: string]: LocalizationValue}}
     */
    async getKeyValueStartsWith(key, locale) {
      // Validate the tuple and lowercase it
      const tuple = validateLocalizationTuple({ key, locale });

      try {
        const localizations = await this.model.find({
          key_$startsWith: tuple.key,
          locale: tuple.locale,
        });

        return localizations.reduce((result, { key: lKey, value }) => {
          const _result = result;

          _result[lKey] = value;

          return _result;
        }, {});
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while getting the localization');
      }
    }
  };
