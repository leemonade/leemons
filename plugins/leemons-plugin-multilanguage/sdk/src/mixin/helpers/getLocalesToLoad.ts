import { areLocalesHashesSaved } from "./areLocalesHashesSaved";
import type { GetLocalesToLoadParams } from "./types";

/**
 * Determines which locales need to be loaded based on the provided hash per locale.
 * @param {GetLocalesToLoadParams} params The function parameters.
 * @returns {Promise<string[]>} An array of locale strings that need to be loaded.
 */
export async function getLocalesToLoad({
  hashPerLocale,
  KeyValuesModel,
}: GetLocalesToLoadParams): Promise<string[]> {
  const localesSaved = await areLocalesHashesSaved({
    KeyValuesModel,
    hashPerLocale,
  });

  return Object.entries(localesSaved)
    .filter(([_, saved]) => !saved)
    .map(([locale]) => locale);
}
