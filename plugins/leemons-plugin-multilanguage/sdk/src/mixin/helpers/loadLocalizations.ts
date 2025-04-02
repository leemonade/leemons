import type { ServiceSchema } from '@leemons/moleculer';
import { pick } from 'lodash';
import { getLocalesToLoad } from './getLocalesToLoad';
import { getLocalizationHashByLocale } from './getLocalizationHashByLocale';
import { getLocalizationsObjects } from './getLocalizationsObjects';
import { acquireLock } from './lock/acquireLock';
import { releaseLock } from './lock/releaseLock';
import { saveHash } from './saveHash';
import type { LocalizationsMap, LocalizationsParams } from './types';

/**
 * Loads localizations from files and updates the database accordingly.
 * Ensures that only one instance of this function is running at a time.
 * Ensures that the localizations are only loaded if they have changed.
 *
 * @param {LocalizationsParams} params - The parameters for loading localizations.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
export async function loadLocalizations(
  this: ServiceSchema,
  { KeyValuesModel, locales, i18nPath }: LocalizationsParams
): Promise<void> {
  const localizations = getLocalizationsObjects({
    locales,
    i18nPath,
    logger: this.logger,
  });
  const hashPerLocale = getLocalizationHashByLocale({ localizations });

  const localesToSave = await getLocalesToLoad({
    hashPerLocale,
    KeyValuesModel,
  });

  if (!localesToSave.length) {
    return;
  }

  await this.broker?.waitForServices('v1.multilanguage.global');

  const isLockAcquired = await acquireLock({
    KeyValueModel: KeyValuesModel,
    lockName: 'loadLocalizations',
  });

  if (!isLockAcquired) {
    return;
  }

  try {
    const savedSuccessfully = await this.broker?.call(
      'v1.multilanguage.global.loadLocalizations',
      {
        localizations: pick(localizations, localesToSave) as LocalizationsMap,
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
      await saveHash({
        KeyValuesModel,
        hashPerLocale: pick(hashPerLocale, localesToSave),
      });
    }
  } catch (e) {
    this.logger?.error('Error while loading localizations', e as Error);
  } finally {
    await releaseLock({
      KeyValueModel: KeyValuesModel,
      lockName: 'loadLocalizations',
    });
  }
}
