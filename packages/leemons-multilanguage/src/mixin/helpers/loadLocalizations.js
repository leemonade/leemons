const { pick } = require('lodash');
const { getLocalizationsObjects } = require('./getLocalizationsObjects');
const { saveHash } = require('./saveHash');
const { getLocalizationHashByLocale } = require('./getLocalizationHashByLocale');
const { acquireLock } = require('./lock/acquireLock');
const { releaseLock } = require('./lock/releaseLock');
const { getLocalesToLoad } = require('./getLocalesToLoad');

/**
 * Loads localizations from files and updates the database accordingly.
 * Ensures that only one instance of this function is running at a time.
 * Ensures that the localizations are only loaded if they have changed.
 *
 * @param {Object} params - The parameters for loading localizations.
 * @param {Object} params.KeyValuesModel - The KeyValues model to interact with the database.
 * @param {string[]} params.locales - The list of locales to load localizations for.
 * @param {string} params.i18nPath - The path to the localization files.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */

async function loadLocalizations({ KeyValuesModel, locales, i18nPath }) {
  const localizations = getLocalizationsObjects({ locales, i18nPath, logger: this.logger });
  const hashPerLocale = getLocalizationHashByLocale({ localizations });

  const localesToSave = await getLocalesToLoad({
    hashPerLocale,
    KeyValuesModel,
  });

  if (!localesToSave.length) {
    return;
  }

  await this.broker.waitForServices('v1.multilanguage.global');

  const isLockAcquired = await acquireLock({
    KeyValueModel: KeyValuesModel,
    lockName: 'loadLocalizations',
  });

  if (!isLockAcquired) {
    return;
  }

  try {
    const savedSuccessfully = await this.broker.call(
      'v1.multilanguage.global.loadLocalizations',
      {
        localizations: pick(localizations, localesToSave),
        plugin: this.name.split('.')[0],
        version: this.version ?? null,
      },
      {
        meta: {
          deploymentID: 'global',
        },
      }
    );

    if (savedSuccessfully) {
      await saveHash({ KeyValuesModel, hashPerLocale: pick(hashPerLocale, localesToSave) });
    }
  } catch (e) {
    this.logger.error('Error while loading localizations', e);
  } finally {
    await releaseLock({ KeyValueModel: KeyValuesModel, lockName: 'loadLocalizations' });
  }
}

module.exports = { loadLocalizations };
