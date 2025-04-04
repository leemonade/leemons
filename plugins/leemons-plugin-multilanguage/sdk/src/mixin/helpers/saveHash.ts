import { HASH_DOCUMENT_KEY } from "../constants";
import { getHashKey } from "./getHashKey";
import type { SaveHashParams } from "./types";

/**
 * Saves the hash for each locale in the database.
 * If the hash document does not exist, it creates a new document with the hash for each locale.
 * If the hash document exists, it updates the document with the new hash for each locale.
 *
 * @param {SaveHashParams} params - The parameters for saving the hash.
 * @returns {Promise<void>} A promise that resolves when the hash is saved.
 */
export async function saveHash({
  KeyValuesModel,
  hashPerLocale,
}: SaveHashParams): Promise<void> {
  const locales = Object.keys(hashPerLocale);

  const hashDocumentExists = await KeyValuesModel.countDocuments({
    key: HASH_DOCUMENT_KEY,
  });

  if (!hashDocumentExists) {
    const value: Record<string, Record<string, boolean>> = {};

    locales.forEach((locale) => {
      value[locale] = { [hashPerLocale[locale]]: true };
    });

    await KeyValuesModel.create({
      key: HASH_DOCUMENT_KEY,
      value,
    });
  } else {
    const $set: Record<string, boolean | Record<string, boolean>> = {};

    if (process.env.FORCE_RELOAD_I18N === "true") {
      locales.forEach((locale) => {
        $set[`value.${locale}`] = { [hashPerLocale[locale]]: true };
      });
    } else {
      const hashesKeys = locales.map((locale) =>
        getHashKey({ locale, hash: hashPerLocale[locale] })
      );
      hashesKeys.forEach((key) => {
        $set[key] = true;
      });
    }

    await KeyValuesModel.updateOne(
      { key: HASH_DOCUMENT_KEY },
      {
        $set,
      }
    );
  }
}
