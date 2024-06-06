/**
 * Loads localizations into the database.
 *
 * This function takes an object containing localizations, the plugin name, and the context,
 * then updates the database with the provided localizations for each locale.
 * If a localization for a given locale does not exist, it will be created.
 *
 * @param {Object} params - The parameters for loading localizations.
 * @param {Object} params.localizations - The localizations to load, keyed by locale.
 * @param {string} params.plugin - The name of the plugin the localizations belong to.
 * @param {Object} params.ctx - The context object containing the database connection.
 * @returns {Promise<boolean>} A promise that resolves to true when the operation completes.
 */

const { globalNamespace } = require('../../../helpers/cacheKeys');

async function loadLocalizations({ localizations, plugin, ctx }) {
  const locales = Object.keys(localizations);

  const promises = locales.flatMap((locale) => [
    ctx.db.Globals.findOneAndUpdate(
      { plugin, locale },
      { value: localizations[locale] },
      { upsert: true }
    ),
    ctx.cache.deleteByNamespace(globalNamespace),
  ]);

  await Promise.all(promises);

  return true;
}

module.exports = { loadLocalizations };
