const _ = require('lodash');
const { hasMany: hasLocales, has: hasLocale } = require('../locale/has');

const localizationsTable = leemons.query('plugins_multilanguage::localizations');

async function setValue(key, locale, value) {
  try {
    if (!(await hasLocale(locale))) {
      throw new Error('Invalid locale');
    }
    return await localizationsTable.set({ key, locale }, { value });
  } catch (e) {
    if (e.message === 'Invalid locale') {
      throw e;
    }

    leemons.log.debug(e.message);
    throw new Error('An error occurred while updating the localization');
  }
}

async function setKey(key, data) {
  const locales = Object.keys(data);

  // Get the existing locales
  const existingLocales = Object.entries(await hasLocales(locales))
    .filter(([, exists]) => exists)
    .map(([locale]) => locale);

  // Get the localizations for the existing locales (flat array)
  const localizations = _.flatten(
    Object.entries(_.pick(data, existingLocales)).map(([locale, value]) => ({ key, locale, value }))
  );

  try {
    const updatedLocalizations = await localizationsTable.transaction((transacting) =>
      Promise.all(
        localizations.map((localization) => {
          const { value, ...query } = localization;

          return localizationsTable.set(query, { value }, { transacting });
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

async function setMany(data) {
  const locales = Object.keys(data);

  // Get the existing locales
  const existingLocales = Object.entries(await hasLocales(locales))
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
    const modifiedLocalizations = await localizationsTable.transaction((transacting) =>
      Promise.all(
        localizations.map((localization) => {
          const { value, ...query } = localization;
          return localizationsTable.set(query, { value });
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

module.exports = {
  setValue,
  setKey,
  setMany,
};
