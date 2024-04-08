const { sha1 } = require('object-hash');

/**
 * @typedef {Object} HashPerItem
 * @description An object mapping each item to its corresponding hash.
 * @property {string} [key] Each key in this object is a unique identifier for an item.
 * @property {string} value The hash string associated with that item.
 * @example
 * // Example of a HashPerItem object
 * const hashPerItemExample = {
 *   item1: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
 *   item2: "da39a3ee5e6b4b0d3255bfef95601890afd80709"
 * };
 */

/**
 * Generates a hash for each Item in the provided object.
 *
 * This function takes an object containing items,
 * computes a SHA1 hash for the content of each item, and returns an object
 * mapping each item to its corresponding hash.
 *
 * @param {Object} params - The parameters for the function.
 * @param {{[itemKey: string]: any}} params.items - The items to hash, keyed by item key.
 * @returns {HashPerItem} An object mapping each item key to the hash of its content.
 */

function getItemsHashByKey({ items }) {
  const itemKeys = Object.keys(items);
  const hashPerItem = {};

  itemKeys.map(async (itemKey) => {
    hashPerItem[itemKey] = sha1(items[itemKey]);
  });

  return hashPerItem;
}

module.exports = { getItemsHashByKey };
