/**
 * @typedef {import('./getItemsHashByKey').HashPerItem} HashPerItem
 */

const { get } = require('lodash');
const { getItemHashKey } = require('./getItemHashKey');

/**
 * Checks if the hashes for the given template are already saved in the database.
 *
 * @param {Object} param0 - The parameters object containing all necessary data.
 * @param {Object} param0.KeyValuesModel - The Mongoose model used for querying the database.
 * @param {HashPerItem} param0.hashPerItem - An object mapping each item to its corresponding hash.
 * @param {string} [param0.documentKey='default'] - The key used to identify the document in the database.
 * @returns {Promise<Object>} An object where keys are item identifiers and values are the persisted hashes or false if not found.
 *
 * @example
 * // Example of hashPerItem input
 * const hashPerItem = {
 *   item1: "hash1",
 *   item2: "hash2",
 *   item3: "hash3"
 * };
 *
 * // Assuming the function is called with the above hashPerItem and appropriate KeyValuesModel
 * getPersistedItemsHashes({ KeyValuesModel, hashPerItem, documentKey: 'exampleKey' }).then(result => {
 *   console.log(result);
 *   // Output might look like this:
 *   // {
 *   //   item1: "persistedHash1",
 *   //   item2: false,
 *   //   item3: "persistedHash3"
 *   // }
 * });
 */
async function getPersistedItemsHashes({ KeyValuesModel, hashPerItem, documentKey = 'default' }) {
  const itemKeys = Object.keys(hashPerItem);
  const keys = itemKeys.map((key) => getItemHashKey({ key, hash: hashPerItem[key] }));

  const persistedHashes =
    (await KeyValuesModel.findOne({
      key: documentKey,
    })
      .select(keys)
      .lean()) ?? {};

  const persistedItems = {};

  itemKeys.forEach((key, i) => {
    persistedItems[key] = get(persistedHashes, keys[i], false);
  });

  return persistedItems;
}

module.exports = { getPersistedItemsHashes };
