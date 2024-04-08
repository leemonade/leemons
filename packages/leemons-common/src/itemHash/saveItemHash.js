/**
 * @typedef {import('@leemons/common').HashPerItem} HashPerItem
 */

const { getItemHashKey } = require('./getItemHashKey');

/**
 * Saves the hash for each email template in the database.
 * If the hash document does not exist, it creates a new document with the hash for each template.
 * If the hash document exists, it updates the document with the new hash for each template.
 *
 * @param {Object} params - The parameters for saving the hash.
 * @param {Object} params.KeyValuesModel - The Mongoose model for key-value pairs.
 * @param {HashPerItem} params.hashPerItem - An object mapping each template to its hash.
 * @param {string} params.documentKey - The key for the hash document in the database.
 * @param {boolean} params.forceReload - Whether to force a reload of the hash document.
 */
async function saveItemHash({ KeyValuesModel, hashPerItem, documentKey, forceReload }) {
  const itemsKeys = Object.keys(hashPerItem);
  const hashDocumentExists = await KeyValuesModel.countDocuments({
    key: documentKey,
  });

  if (!hashDocumentExists) {
    const value = {};

    itemsKeys.forEach((itemKey) => {
      value[itemKey] = { [hashPerItem[itemKey]]: true };
    });
    await KeyValuesModel.create({
      key: documentKey,
      value,
    });
  } else {
    const $set = {};

    if (forceReload) {
      itemsKeys.forEach((itemKey) => {
        $set[`value.${itemKey}`] = { [hashPerItem[itemKey]]: true };
      });
    } else {
      const hashesKeys = itemsKeys.map((itemKey) =>
        getItemHashKey({ key: itemKey, hash: hashPerItem[itemKey] })
      );
      hashesKeys.forEach((key) => {
        $set[key] = true;
      });
    }

    await KeyValuesModel.updateOne(
      { key: documentKey },
      {
        $set,
      }
    );
  }
}

module.exports = { saveItemHash };
