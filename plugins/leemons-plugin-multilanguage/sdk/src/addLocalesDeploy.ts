import type { Context } from '@leemons/moleculer';
import type { Model } from '@leemons/mongodb';
import { hasKey, setKey } from '@leemons/mongodb-helpers';
import type { GetKeyValueModel } from '@leemons/mongodb-helpers';
import { isArray, map } from 'lodash';
import { addLocales } from './addLocales';

interface AddLocalesDeployParams {
  keyValueModel: Model<GetKeyValueModel>;
  locale: string | string[];
  i18nPath: string;
  ctx: Context;
}

/**
 * Executes the locale deployment for a single locale
 * @param {AddLocalesDeployParams} params - The parameters for deploying a locale
 * @returns {Promise<void>} A promise that resolves when the locale is deployed
 */
async function exec({
  keyValueModel,
  locale,
  i18nPath,
  ctx,
}: AddLocalesDeployParams): Promise<void> {
  if (
    !(await hasKey(keyValueModel, `locale-${locale}-configured`)) ||
    process.env.RELOAD_I18N_ON_EVERY_INSTALL === 'true'
  ) {
    const { count } = await addLocales({
      ctx,
      locales: locale,
      i18nPath,
    });
    if (count) {
      await setKey(keyValueModel, `locale-${locale}-configured`);
    }
  }
}

/**
 * Deploys locales by adding them to the system and marking them as configured
 * @param {AddLocalesDeployParams} params - The parameters for deploying locales
 * @returns {Promise<void>} A promise that resolves when all locales are deployed
 */
export async function addLocalesDeploy({
  keyValueModel,
  locale,
  i18nPath,
  ctx,
}: AddLocalesDeployParams): Promise<void> {
  const locales = isArray(locale) ? locale : [locale];

  await Promise.all(map(locales, (l) => exec({ keyValueModel, locale: l, i18nPath, ctx })));
}
