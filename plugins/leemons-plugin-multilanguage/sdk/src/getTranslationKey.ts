import type { Context } from '@leemons/moleculer';
import { getPluginNameFromCTX } from '@leemons/service-name-parser';

interface GetTranslationKeyParams {
  locationName: string;
  pluginName: string;
  key?: string;
  ctx: Context;
}

/**
 * Return the key for translation
 * @public
 * @static
 * @param {GetTranslationKeyParams} params - The parameters for generating the translation key
 * @return {string} The generated translation key
 */
export function getTranslationKey({
  locationName,
  pluginName,
  key,
  ctx,
}: GetTranslationKeyParams): string {
  const _pluginName = getPluginNameFromCTX(ctx);
  if (key) {
    return `${_pluginName}.${locationName}.${pluginName}.${key}`;
  }

  return `${_pluginName}.${locationName}.${pluginName}`;
}
