/**
 * @typedef {import('./getItemsHashByKey').HashPerItem} HashPerItem
 */

const { getPersistedItemsHashes } = require('./getPersistedItemsHashes');

/**
 * Determines which items need to be added based on the provided hash per item.
 *
 * @param {Object} params The function parameters.
 * @param {HashPerItem} params.hashPerItem An object mapping each item key to its hash.
 * @param {Object} params.KeyValuesModel The Mongoose model to interact with the key-values store.
 * @param {string} params.documentKey The key used to identify the document in the database.
 * @param {boolean} params.forceReload Whether to force a reload of the persisted items hashes
 * @returns {Promise<string[]>} An array of item keys that need to be added. These are the keys for which the persisted hash check returned false, indicating they are not present in the database.
 *
 * @example
 * // Suppose getPersistedItemsHashes returns:
 * // {
 * //   "item1": true, // This item is already present
 * //   "item2": false, // This item needs to be added
 * //   "item3": true, // This item is already present
 * //   "item4": false, // This item needs to be added
 * // }
 * // Then, getItemsToAdd would return:
 * getItemsToAdd({
 *   hashPerItem: { item1: 'hash1', item2: 'hash2', item3: 'hash3', item4: 'hash4' },
 *   KeyValuesModel: YourMongooseModel,
 *   documentKey: 'yourDocumentKey'
 * });
 * // Expected output: ["item2", "item4"]
 */
async function getItemsToAdd({ hashPerItem, KeyValuesModel, documentKey, forceReload }) {
  const persistedItems = await getPersistedItemsHashes({
    KeyValuesModel,
    hashPerItem,
    documentKey,
  });

  return Object.entries(persistedItems)
    .filter(([, saved]) => forceReload || !saved)
    .map(([itemKey]) => itemKey);
}

module.exports = { getItemsToAdd };
