import { sha1 } from "object-hash";
import type { GetLocalizationHashByLocaleParams, HashPerLocale } from "./types";

/**
 * Generates a hash for each locale's localizations.
 *
 * This function takes an object containing localizations for different locales,
 * computes a SHA1 hash for the localizations of each locale, and returns an object
 * mapping each locale to its corresponding hash.
 *
 * @param {GetLocalizationHashByLocaleParams} params - The parameters for the function.
 * @returns {HashPerLocale} An object mapping each locale to the hash of its localizations.
 */
export function getLocalizationHashByLocale({
  localizations,
}: GetLocalizationHashByLocaleParams): HashPerLocale {
  const locales = Object.keys(localizations);
  const hashPerLocale: HashPerLocale = {};

  locales.forEach((locale) => {
    hashPerLocale[locale] = sha1(localizations[locale]);
  });

  return hashPerLocale;
}
