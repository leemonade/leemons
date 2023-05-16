const _ = require('lodash');

const { withTransaction } = global.utils;

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
    async setValue(key, locale, value, { transacting } = {}) {
      // Validates the localization and returns it with the key and locale lowercased
      const { key: _key, locale: _locale } = this.validator.validateLocalization(
        { key, locale, value },
        true
      );
      try {
        return await withTransaction(
          async (t) => {
            if (!(await this.hasLocale(_locale, { transacting: t }))) {
              throw new Error('Invalid locale');
            }
            return this.model.set({ key: _key, locale: _locale }, { value }, { transacting: t });
          },
          this.model,
          transacting
        );
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
    async setKey(key, data, { transacting } = {}) {
      // Validates the key and returns it lowercased
      const _key = this.validator.validateLocalizationKey(key, true);
      // Validates the tuples [locale, value] and lowercases the locale
      const _data = this.validator.validateLocalizationLocaleValue(data);

      const locales = Object.keys(_data);

      // Get the existing locales
      return withTransaction(
        async (t) => {
          const existingLocales = Object.entries(await this.hasLocales(locales, { transacting: t }))
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
            const updatedLocalizations = await Promise.all(
              localizations.map((localization) => {
                const { value, ...query } = localization;

                return this.model.set(query, { value }, { transacting: t });
              })
            );

            // #region Define Warning object

            // Get an array of the non existing locales
            const nonExistingLocales = locales.filter(
              (locale) => !existingLocales.includes(locale)
            );

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
        },
        this.model,
        transacting
      );
    }

    /**
     * Sets many localizations to the database
     * @param {{[locale:string]: {[key:string]: LocalizationValue}}} data
     * @returns {Promise<{items: Localization[],count: number, warnings: {nonExistingLocales: LocaleCode[] | undefined, existingKeys: LocalizationKey[] | undefined} | null}>}
     */
    async setMany(data, { transacting } = {}) {
      // Validate params
      this.validator.validateLocalizationsBulk(data);

      const locales = Object.keys(data);

      // Get the existing locales
      return withTransaction(
        async (t) => {
          const existingLocales = Object.entries(await this.hasLocales(locales, { transacting: t }))
            .filter(([, exists]) => exists)
            .map(([locale]) => locale);

          // Get an array of the non existing locales
          const nonExistingLocales = [];

          // Get the localizations for the existing locales (flat array)
          let localizations = _.flatten(
            Object.entries(
              _.pickBy(data, (value, key) => {
                const exists = existingLocales.includes(key);
                if (!exists) {
                  nonExistingLocales.push(key);
                }
                return exists;
              })
            ).map(([locale, values]) =>
              Object.entries(values).map(([key, value]) => ({ key, locale, value }))
            )
          );
          // Validate the keys
          localizations = this.validator.validateLocalizationsArray(localizations, true);

          try {
            // Create the new localizations
            const modifiedLocalizations = await Promise.all(
              localizations.map((localization) => {
                const { value, ...query } = localization;
                return this.model.set(query, { value }, { transacting: t });
              })
            );

            // #region Define Warning object

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
        },
        this.model,
        transacting
      );
    }

    async setManyByKey(key, data, { transacting } = {}) {
      // Validates the key and returns it lowercased
      const _key = this.validator.validateLocalizationKey(key, true);
      // Validates the tuples [locale, value] and lowercases the locale
      const _data = this.validator.validateLocalizationLocaleValue(data);

      const locales = Object.keys(_data);

      // Get the existing locales
      return withTransaction(
        async (t) => {
          const existingLocales = Object.entries(await this.hasLocales(locales, { transacting: t }))
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

          const newLocalizations = localizations.map(({ key: __key, locale, value }) => ({
            query: { key: __key, locale },
            item: { value },
          }));

          try {
            const addedLocalizations = await this.model.setMany(newLocalizations, {
              transacting: t,
            });

            // #region Define Warning object

            // Get an array of the non existing locales
            const nonExistingLocales = locales.filter(
              (locale) => !existingLocales.includes(locale)
            );

            let hasWarnings = false;
            let warnings = {};

            // Set non existing language warning
            if (nonExistingLocales.length) {
              hasWarnings = true;
              warnings.nonExistingLocales = nonExistingLocales;
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
        },
        this.model,
        transacting
      );
    }

    async setManyByJSON(data, prefix, { transacting } = {}) {
      const toAdd = {};
      _.forIn(data, (json, lang) => {
        toAdd[lang] = {};
        _.forEach(global.utils.getObjectArrayKeys(json), (key) => {
          toAdd[lang][`${prefix}${key}`] = _.get(data[lang], key);
        });
      });

      return this.setMany.call(this, toAdd, { transacting });
    }
  };
