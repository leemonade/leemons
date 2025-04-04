import { get } from "lodash";
import { HASH_DOCUMENT_KEY } from "../constants";
import { getHashKey } from "./getHashKey";
import type { AreLocalesHashesSavedParams, LocalesSaved } from "./types";

/**
 * Checks if the hashes for the given locales are already saved in the database.
 * @param {AreLocalesHashesSavedParams} params The function parameters
 * @returns {Promise<LocalesSaved>} An object mapping each locale to whether its hash is saved
 */
export async function areLocalesHashesSaved({
  KeyValuesModel,
  hashPerLocale,
}: AreLocalesHashesSavedParams): Promise<LocalesSaved> {
  const locales = Object.keys(hashPerLocale);
  const keys = locales.map((locale) =>
    getHashKey({ locale, hash: hashPerLocale[locale] })
  );

  const hashesSaved =
    (await KeyValuesModel.findOne({
      key: HASH_DOCUMENT_KEY,
    })
      .select(keys)
      .lean()) ?? {};

  const localesSaved: LocalesSaved = {};

  locales.forEach((locale, i) => {
    localesSaved[locale] = get(hashesSaved, keys[i], false);
  });

  return localesSaved;
}
