const { map, uniq, get, isString, pick } = require('lodash');
const { flatten } = require('flat');
const { parseLocalizationsKey } = require('./parseLocalizationsKey');

/**
 * Retrieves localizations for keys that start with specified patterns and a given locale.
 * for matching localizations, and returns the localizations mapped to the flatten keys.
 * It supports fetching nested localizations by flattening the results and filtering by the key pattern.
 *
 * @param {Object} params - The parameters for fetching localizations.
 * @param {Array<string>} params.keysStartsWith - The key patterns to fetch localizations for.
 * @param {string} params.locale - The locale for which to fetch the localizations.
 * @param {Object} params.ctx - The context object containing the database connection and other relevant information.
 * @returns {Promise<{[key: string]: string}>} A promise that resolves to an object containing the fetched localizations mapped to the flatten keys.
 */

async function getLocalizationsByKeysStartsWith({ keysStartsWith, locale, ctx }) {
  const parsedKeys = keysStartsWith.map(parseLocalizationsKey);
  const plugins = uniq(map(parsedKeys, 'plugin'));
  const keyPaths = parsedKeys
    .filter(({ key }) => key)
    .map(({ parentKey, key }) => `value.${parentKey ?? key}`);

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

  let localizations = {};

  parsedKeys.forEach((parsedKey) => {
    const value = get(
      keysFoundByPlugin,
      `${parsedKey.plugin}.value.${parsedKey.parentKey ?? parsedKey.keyPath}`,
      null
    );

    if (!value) {
      return;
    }

    if (isString(value)) {
      localizations[parsedKey.original] = value;

      return;
    }

    const flat = flatten({
      [`${parsedKey.plugin}.${parsedKey.parentKey ?? parsedKey.key}`]: value,
    });

    const keys = Object.keys(flat);

    const keysMatching = keys.filter((key) => key.startsWith(parsedKey.original));

    const matchingLocalizations = pick(flat, keysMatching);

    localizations = {
      ...localizations,
      ...matchingLocalizations,
    };
  });

  return localizations;
}

module.exports = { getLocalizationsByKeysStartsWith };
