const { clone } = require('lodash');

/**
 * Parses a localization key into its constituent parts.
 *
 * This function takes a dot-separated string and splits it into its constituent parts,
 * identifying the plugin name, the full key path, the parent key path, and the final key segment.
 * It is used to facilitate the retrieval and organization of localization strings from the database.
 *
 * @param {string} key - The localization key to be parsed, typically in the format 'pluginName.path.to.key'.
 * @returns {{plugin: string, original: string, keyPath: string, parentKey: string, key: string}} An object containing the parsed elements of the key:
 *                   - plugin: The name of the plugin the key belongs to.
 *                   - original: The original key string.
 *                   - keyPath: The full path to the key, excluding the plugin name.
 *                   - parentKey: The path to the parent key, excluding the plugin name, or null if there is none.
 *                   - key: The final segment of the key path.
 */

function parseLocalizationsKey(key) {
  const splittedKey = key.split('.');
  const plugin = splittedKey.shift();

  const parentSplittedKey = clone(splittedKey);
  parentSplittedKey.pop();

  return {
    plugin,
    original: key,
    keyPath: splittedKey.join('.'),
    parentKey: parentSplittedKey.length ? parentSplittedKey.join('.') : null,
    key: splittedKey[splittedKey.length - 1],
  };
}

module.exports = { parseLocalizationsKey };
