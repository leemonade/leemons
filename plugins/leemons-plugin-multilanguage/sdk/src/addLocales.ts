import type { AnyContext } from '@leemons/moleculer';
import { flattenDeep } from 'lodash';
import type { LocalizationObject } from './mixin/helpers/types';

interface AddLocalesParams {
  locales: string | string[];
  i18nPath: string;
  ctx: AnyContext;
}

interface AddLocalesResponse {
  count: number;
}

/**
 * Adds localizations for the specified locales from the given path.
 * @param {AddLocalesParams} params - The parameters for adding localizations
 * @returns {Promise<AddLocalesResponse>} A promise that resolves with the count of added localizations
 */
export async function addLocales({
  locales: _locales,
  i18nPath,
  ctx,
}: AddLocalesParams): Promise<AddLocalesResponse> {
  const locales = flattenDeep([_locales]);
  const localesData: Record<string, LocalizationObject> = {};

  for (let i = 0, len = locales.length; i < len; i++) {
    const locale = locales[i];
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
      localesData[locale] = require(`${i18nPath}/${locale}.js`);
    } catch (e) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        localesData[locale] = require(`${i18nPath}/${locale}.json`);
      } catch (err) {
        ctx.logger.error(
          `Unable to load locale: ${i18nPath}/${locale}.js or ${i18nPath}/${locale}.json`
        );
      }
    }
  }

  return ctx.tx.call('multilanguage.common.setManyByJSON', {
    data: localesData,
  }) as Promise<AddLocalesResponse>;
}
