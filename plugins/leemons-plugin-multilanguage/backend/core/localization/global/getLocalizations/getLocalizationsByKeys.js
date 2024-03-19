const { map, uniq, get, isString } = require('lodash');
const { parseLocalizationsKey } = require('./parseLocalizationsKey');

/**
 * Retrieves localizations for the specified keys and locale.
 * This function parses the keys to extract plugin names and key paths,
 * queries the database for matching localizations, and returns the localizations
 * mapped to the original keys.
 *
 * @param {Object} params - The parameters for fetching localizations.
 * @param {Array<string>} params.keys - The specific keys to fetch localizations for.
 * @param {string} params.locale - The locale for which to fetch the localizations.
 * @param {Object} params.ctx - The context object containing the database connection and other relevant information.
 * @returns {Promise<{[key: string]: string}>} A promise that resolves to an object containing the fetched localizations mapped to the flatten keys.
 */

async function getLocalizationsByKeys({ keys, locale, ctx }) {
  const parsedKeys = keys.map(parseLocalizationsKey);
  const plugins = uniq(map(parsedKeys, 'plugin'));
  const keyPaths = parsedKeys
    .filter(({ keyPath }) => keyPath)
    .map(({ keyPath }) => `value.${keyPath}`);

  const filteredKeyPaths = keyPaths.filter(
    (keyPath) =>
      !keyPaths.some((otherKeyPath) => otherKeyPath !== keyPath && keyPath.startsWith(otherKeyPath))
  );

  const keysFound = await ctx.db.Globals.find({ plugin: { $in: plugins }, locale })
    .select(['plugin', ...filteredKeyPaths])
    .lean();

  const keysFoundByPlugin = {};

  keysFound.forEach((keyFound) => {
    if (!keysFoundByPlugin[keyFound.plugin]) {
      keysFoundByPlugin[keyFound.plugin] = {};
    }

    keysFoundByPlugin[keyFound.plugin] = keyFound;
  });

  const localizations = {};

  parsedKeys.forEach((parsedKey) => {
    const value = get(keysFoundByPlugin, `${parsedKey.plugin}.value.${parsedKey.keyPath}`, null);

    if (isString(value)) {
      localizations[parsedKey.original] = value;
    }
  });

  return localizations;
}

module.exports = { getLocalizationsByKeys };
