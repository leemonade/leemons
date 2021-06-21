const _ = require('lodash');
const {
  validateLocalization,
  validateLocalizationsBulk,
  validateLocalizationsArray,
  validateLocalizationLocaleValue,
  validateLocalizationKey,
} = require('../../validations/localization');

const LocaleProvider = require('../locale');

// A mixing for extending all the needed classes
module.exports = (Base) =>
  class LocalizationAdd extends Base {
    constructor(...args) {
      super(...args);

      // Add the hasLocale and has hasManyLocales to all the Localizations
      const locales = new LocaleProvider(leemons.query('plugins_multilanguage::locales'));

      this.hasLocale = locales.has.bind(locales);
      this.hasLocales = locales.hasMany.bind(locales);
    }

    /**
     * Adds one locale
     * @param {LocalizationKey} key The localization key
     * @param {LocaleCode} locale The locale for the localization
     * @param {LocalizationValue} value The value for the entry
     * @returns {Promise<Localization | null>} null if the locale already exists and the locale object if created
     */
    async add(key, locale, value) {
      // Validates the localization and returns it with the key and locale lowercased
      const { key: _key, locale: _locale } = validateLocalization({ key, locale, value });

      try {
        // Check if the localization exists
        if (!(await this.has(_key, _locale))) {
          // Check if the locale exists
          if (await this.hasLocale(_locale)) {
            // Create the new localization
            return await this.model.create({ key: _key, locale: _locale, value });
          }

          // The given locale does not exists
          throw new Error('Invalid locale');
        }
        // No localization created (already exists)
        return null;
      } catch (e) {
        if (e.message === 'Invalid locale') {
          throw e;
        }
        leemons.log.debug(e.message);
        throw new Error('An error occurred while creating the localization');
      }
    }

    /**
     * Adds many localizations to the database
     * @param {{[locale:string]: {[key:string]: LocalizationValue}}} data
     * @returns {Promise<{items: Localization[],count: number, warnings: {nonExistingLocales: LocaleCode[] | undefined, existingKeys: LocalizationKey[] | undefined} | null}>}
     */
    async addMany(data) {
      // Validate params
      validateLocalizationsBulk(data);

      const locales = Object.keys(data);

      // Get the existing locales
      const existingLocales = Object.entries(await this.hasLocales(locales))
        .filter(([, exists]) => exists)
        .map(([locale]) => locale);

      // Get the localizations for the existing locales (flat array)
      let localizations = _.flatten(
        Object.entries(_.pick(data, existingLocales)).map(([locale, values]) =>
          Object.entries(values).map(([key, value]) => ({ key, locale, value }))
        )
      );

      // Validate localizations formats (get them with key and locale lowercased)
      localizations = validateLocalizationsArray(localizations);

      // Get the DB existing localizations
      const existingLocalizations = await this.hasMany(
        localizations.map(({ key, locale }) => [key, locale])
      );

      // Get the new localizations
      const newLocalizations = localizations.filter(
        ({ key, locale }) => !existingLocalizations[locale][key]
      );

      try {
        // Create the new localizations
        const addedLocalizations = await this.model.createMany(newLocalizations);

        // #region Define Warning object

        // Get an array of the non existing locales
        const nonExistingLocales = locales.filter((locale) => !existingLocales.includes(locale));
        // Get an object with the existing keys: { en: ['key.1', 'key.2'] }, if no existing key: null
        const existingKeys = Object.entries(existingLocalizations).reduce(
          (result, [locale, keys]) => {
            const _result = result === null ? {} : result;
            const _keys = Object.entries(keys)
              .filter(([, exists]) => exists)
              .map(([_key]) => _key);

            if (!_keys.length) {
              return result;
            }
            _result[locale] = _keys;
            return _result;
          },
          null
        );

        let hasWarnings = false;
        let warnings = {};

        // Set non existing language warning
        if (nonExistingLocales.length) {
          hasWarnings = true;
          warnings.nonExistingLocales = nonExistingLocales;
        }

        // Set existing keys warning
        if (existingKeys !== null) {
          hasWarnings = true;
          warnings.existingKeys = existingKeys;
        }

        if (!hasWarnings) {
          warnings = null;
        }
        // #endregion

        return {
          items: addedLocalizations,
          count: addedLocalizations.length,
          warnings,
        };
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while creating the localizations');
      }
    }

    /**
     * Adds many localizations to the database for the same key
     * @param {LocalizationKey} key
     * @param {{[key:string]: LocalizationValue}} data
     * @returns {Promise<{items: Localization[],count: number, warnings: {nonExistingLocales: LocaleCode[] | undefined, existingLocalizations: LocaleCode[] | undefined} | null}}
     */
    async addManyByKey(key, data) {
      // Validates the key and returns it lowercased
      const _key = validateLocalizationKey(key);
      // Validates the tuples [locale, value] and lowercases the locale
      const _data = validateLocalizationLocaleValue(data);

      const locales = Object.keys(_data);

      // Get the existing locales
      const existingLocales = Object.entries(await this.hasLocales(locales))
        .filter(([, exists]) => exists)
        .map(([locale]) => locale);

      // Get the localizations for the existing locales (flat array)
      const localizations = _.flatten(
        Object.entries(_.pick(_data, existingLocales)).map(([locale, value]) => ({
          key: _key,
          locale,
          value,
        }))
      );

      const existingLocalizations = await this.hasMany(
        localizations.map(({ key: __key, locale }) => [__key, locale])
      );

      const newLocalizations = localizations.filter(
        ({ key: __key, locale }) => !existingLocalizations[locale][__key]
      );

      try {
        const addedLocalizations = await this.model.createMany(newLocalizations);

        // #region Define Warning object

        // Get an array of the non existing locales
        const nonExistingLocales = locales.filter((locale) => !existingLocales.includes(locale));
        // Get an array with the existing localized locales: ['en', 'es']
        const _existingLocalizations = Object.entries(existingLocalizations)
          .filter(([, keys]) => Object.values(keys)[0])
          .map(([locale]) => locale);

        let hasWarnings = false;
        let warnings = {};

        // Set non existing language warning
        if (nonExistingLocales.length) {
          hasWarnings = true;
          warnings.nonExistingLocales = nonExistingLocales;
        }

        // Set existing keys warning
        if (_existingLocalizations.length) {
          hasWarnings = true;
          warnings.existingLocalizations = _existingLocalizations;
        }

        if (!hasWarnings) {
          warnings = null;
        }
        // #endregion

        return {
          items: addedLocalizations,
          count: addedLocalizations.length,
          warnings,
        };
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while creating the localizations');
      }
    }
  };
