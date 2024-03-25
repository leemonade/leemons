const { getHashKey } = require('./getHashKey');
const { HASH_DOCUMENT_KEY } = require('../constants');

/**
 * Saves the hash for each locale in the database.
 * If the hash document does not exist, it creates a new document with the hash for each locale.
 * If the hash document exists, it updates the document with the new hash for each locale.
 *
 * @param {Object} params - The parameters for saving the hash.
 * @param {Object} params.KeyValuesModel - The Mongoose model for key-value pairs.
 * @param {{[locale: string]: string}} params.hashPerLocale - An object mapping each locale to its hash.
 */
async function saveHash({ KeyValuesModel, hashPerLocale }) {
  const locales = Object.keys(hashPerLocale);

  const hashDocumentExists = await KeyValuesModel.countDocuments({
    key: HASH_DOCUMENT_KEY,
  });

  if (!hashDocumentExists) {
    const value = {};

    locales.forEach((locale) => {
      value[locale] = { [hashPerLocale[locale]]: true };
    });
    await KeyValuesModel.create({
      key: HASH_DOCUMENT_KEY,
      value,
    });
  } else {
    const $set = {};

    if (process.env.FORCE_RELOAD_I18N === 'true') {
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

module.exports = { saveHash };
