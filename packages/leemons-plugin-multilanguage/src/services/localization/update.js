const _ = require('lodash');
const {
  validateLocalization,
  validateLocalizationKey,
  validateLocalizationLocaleValue,
  validateLocalizationsBulk,
} = require('../../validations/localization');

// A mixing for extending all the needed classes
module.exports = (Base) =>
  class LocalizationSet extends Base {
    /**
     * Sets the value of a locale, if this does not exists, it creates it
     * @param {LocalizationKey} key The localization key
     * @param {LocaleCode} locale The locale for the localization
     * @param {LocalizationValue} value The value for the entry
     * @returns {Promise<Localization | null>} null if the locale already exists and the locale object if created
     */
    async setValue(key, locale, value) {
      // Validates the localization and returns it with the key and locale lowercased
      const { key: _key, locale: _locale } = validateLocalization({ key, locale, value });
      try {
        if (!(await this.hasLocale(_locale))) {
          throw new Error('Invalid locale');
        }
        return await this.model.set({ key: _key, locale: _locale }, { value });
      } catch (e) {
        if (e.message === 'Invalid locale') {
          throw e;
        }

        leemons.log.debug(e.message);
        throw new Error('An error occurred while updating the localization');
      }
    }

    /**
     * Sets the values for a key in different locales
     * @param {LocalizationKey} key
     * @param {{[key:string]: LocalizationValue}} data
     * @returns {Promise<{items: Localization[],count: number, warnings: {nonExistingLocales: LocaleCode[] | undefined, existingLocalizations: LocaleCode[] | undefined} | null}}
     */
    async setKey(key, data) {
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

      try {
        const updatedLocalizations = await this.model.transaction((transacting) =>
          Promise.all(
            localizations.map((localization) => {
              const { value, ...query } = localization;

              return this.model.set(query, { value }, { transacting });
            })
          )
        );

        // #region Define Warning object

        // Get an array of the non existing locales
        const nonExistingLocales = locales.filter((locale) => !existingLocales.includes(locale));

        let warnings = null;

        // Set non existing language warning
        if (nonExistingLocales.length) {
          warnings = { nonExistingLocales };
        }

        // #endregion

        return {
          items: updatedLocalizations,
          count: updatedLocalizations.length,
          warnings,
        };
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while creating the localizations');
      }
    }

    /**
     * Sets many localizations to the database
     * @param {{[locale:string]: {[key:string]: LocalizationValue}}} data
     * @returns {Promise<{items: Localization[],count: number, warnings: {nonExistingLocales: LocaleCode[] | undefined, existingKeys: LocalizationKey[] | undefined} | null}>}
     */
    async setMany(data) {
      // Validate params
      validateLocalizationsBulk(data);

      const locales = Object.keys(data);

      // Get the existing locales
      const existingLocales = Object.entries(await this.hasLocales(locales))
        .filter(([, exists]) => exists)
        .map(([locale]) => locale);

      // Get the localizations for the existing locales (flat array)
      const localizations = _.flatten(
        Object.entries(_.pick(data, existingLocales)).map(([locale, values]) =>
          Object.entries(values).map(([key, value]) => ({ key, locale, value }))
        )
      );

      try {
        // Create the new localizations
        const modifiedLocalizations = await this.model.transaction((transacting) =>
          Promise.all(
            localizations.map((localization) => {
              const { value, ...query } = localization;
              return this.model.set(query, { value }, { transacting });
            })
          )
        );

        // #region Define Warning object

        // Get an array of the non existing locales
        const nonExistingLocales = locales.filter((locale) => !existingLocales.includes(locale));

        let warnings = null;

        // Set non existing language warning
        if (nonExistingLocales.length) {
          warnings = { nonExistingLocales };
        }

        // #endregion

        return {
          items: modifiedLocalizations,
          count: modifiedLocalizations.length,
          warnings,
        };
      } catch (e) {
        leemons.log.debug(e.message);
        throw new Error('An error occurred while creating the localizations');
      }
    }
  };
