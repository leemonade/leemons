const { merge, cloneDeep, isEqual } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { LeemonsValidator } = require('@leemons/validator');
const { getLocalizations: getCommonLocalizations } = require('../../common/getLocalizations');
const { getLocalizationsByKeys } = require('./getLocalizationsByKeys');
const { getLocalizationsByKeysStartsWith } = require('./getLocalizationsByKeysStartsWith');
const { getGlobalCacheKey } = require('../../../../helpers/cacheKeys');

/**
 * Retrieves localizations based on provided keys or key patterns and locale.
 * This function merges results from common localizations (deployment-localizations) and global localizations
 * by keys or keys starting with specified patterns. It ensures that the localizations
 * are fetched globally across all plugins and are specific to the requested locale.
 *
 * @param {Object} params - The parameters for fetching localizations.
 * @param {Array<string>} [params.keys] - The specific keys to fetch localizations for.
 * @param {Array<string>} [params.keysStartsWith] - The key patterns to fetch localizations starting with.
 * @param {string} params.locale - The locale for which to fetch the localizations.
 * @param {Object} params.ctx - The context object containing the database connection and other relevant information.
 * @returns {Promise<{items: Object}>} A promise that resolves to an object containing the fetched localizations.
 */

async function getLocalizations({ keys, keysStartsWith, locale, ctx }) {
  const globalCTX = cloneDeep(ctx);
  globalCTX.meta.deploymentID = 'global';
  globalCTX.db = ctx.service.metadata.LeemonsMongoDBMixin.models({
    ctx: globalCTX,
    autoTransaction: false,
    autoLRN: true,
    autoDeploymentID: true,
  });

  /* Schema validation:
   * keys or keysStartsWith required.
   * locale required
   * keys and keysStartsWith is an array of strings
   * locale is a string
   */
  const validator = new LeemonsValidator({
    type: 'object',
    properties: {
      keys: {
        oneOf: [
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          {
            type: 'null',
          },
        ],
      },
      keysStartsWith: {
        oneOf: [
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          {
            type: 'null',
          },
        ],
      },
      locale: {
        oneOf: [
          {
            type: 'string',
          },
          {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        ],
      },
    },
    required: ['locale'],
    anyOf: [
      {
        required: ['keys'],
      },
      {
        required: ['keysStartsWith'],
      },
    ],
  });

  // Validate body
  if (!validator.validate({ keys, keysStartsWith, locale })) {
    throw new LeemonsError(ctx, {
      httpStatusCode: 400,
      message: validator.error,
    });
  }

  const promises = [];

  if (keys) {
    const cacheKey = getGlobalCacheKey({ ctx, locale, keys });

    const cacheResult = await ctx.cache.get(cacheKey);

    if (cacheResult) {
      promises.push(cacheResult);
    } else {
      promises.push(
        getLocalizationsByKeys({ keys, locale, ctx: globalCTX }).then((result) => {
          ctx.cache.set(cacheKey, result);
          return result;
        })
      );
    }
  }

  if (keysStartsWith) {
    const cacheKey = getGlobalCacheKey({ ctx, locale, keysStartsWith });

    const cacheResult = await ctx.cache.get(cacheKey);

    if (cacheResult) {
      promises.push(cacheResult);
    } else {
      promises.push(
        getLocalizationsByKeysStartsWith({ keysStartsWith, locale, ctx: globalCTX }).then(
          (result) => {
            ctx.cache.set(cacheKey, result);
            return result;
          }
        )
      );
    }
  }

  const span = ctx.startSpan('getCommonLocalizations', {
    tags: {
      keys,
      keysStartsWith,
      locale,
    },
  });

  const commonServiceLocalizations = await getCommonLocalizations({
    ctx: {
      ...ctx,
      params: {
        keys,
        keysStartsWith,
        locale,
      },
    },
  });

  ctx.finishSpan(span);

  const items = merge(
    ...(await Promise.allSettled(promises))
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
  );

  return {
    items: merge(items, commonServiceLocalizations.items),
  };
}

module.exports = { getLocalizations };
