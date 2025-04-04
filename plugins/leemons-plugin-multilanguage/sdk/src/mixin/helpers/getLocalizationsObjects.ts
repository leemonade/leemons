import path from "path";
import { flatten } from "lodash";
import type { GetLocalizationsObjectsParams, LocalizationsMap } from "./types";

/**
 * Loads localization files for the specified locales from the given path.
 * Attempts to load both .js and .json files for each locale.
 * Logs an error if neither file type can be loaded for a locale.
 *
 * @param {GetLocalizationsObjectsParams} params - The parameters for loading localizations.
 * @returns {LocalizationsMap} An object mapping each locale to its loaded localizations.
 */
export function getLocalizationsObjects({
  locales: _locales = [],
  i18nPath = "",
  logger,
}: GetLocalizationsObjectsParams): LocalizationsMap {
  const locales = flatten(_locales);
  const localizations: LocalizationsMap = {};

  locales.forEach((locale) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
      const importedFile = require(path.resolve(i18nPath, `${locale}.js`));

      localizations[locale] = importedFile.__esModule
        ? importedFile.default
        : importedFile;
    } catch (e) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
        localizations[locale] = require(
          path.resolve(i18nPath, `${locale}.json`)
        );
      } catch (_) {
        logger?.error(
          `Unable to load locale: ${i18nPath}/${locale}.js and ${i18nPath}/${locale}.json are missing`
        );
      }
    }
  });

  return localizations;
}
