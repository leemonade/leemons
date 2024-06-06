const { LeemonsValidator } = require('@leemons/validator');
const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getManyWithLocale, getKeyStartsWith } = require('..');
const { getCommonCacheKey } = require('../../../helpers/cacheKeys');

async function getLocalizations({ ctx }) {
  const { keys = null, keysStartsWith = null, locale } = ctx.params;

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
  if (!validator.validate(ctx.params)) {
    throw new LeemonsError(ctx, {
      httpStatusCode: 400,
      message: validator.error,
    });
  }

  const cacheKey = getCommonCacheKey({ ctx, locale, keys, keysStartsWith });
  const cache = await ctx.cache.get(cacheKey);

  if (cache) {
    // TODO: Ver por que peta lo cacheado en la pagina de http://localhost:8080/private/dashboard/class/2dd89ae1-a795-402c-808c-9951f130f51a?type=all&sort=assignation&query=&progress=all
    return { items: cache };
  }
  const localizations = [];

  // Get localizations by key
  if (keys) {
    localizations.push(
      getManyWithLocale({
        keys,
        locale,
        isPrivate: false,
        ctx,
      })
    );
  }
  // Get localizations which starts by key
  if (keysStartsWith) {
    localizations.push(
      ...keysStartsWith.map((key) =>
        getKeyStartsWith({
          key,
          locale,
          isPrivate: false,
          ctx,
        }).then((_localizations) =>
          // Return in object format: { key: 'value' }
          _.fromPairs(_localizations.map((localization) => [localization.key, localization.value]))
        )
      )
    );
  }

  // Merge all the received objects
  const resolvedLocalizations = _.merge(
    ...(await Promise.allSettled(localizations))
      .filter((localization) => localization.status === 'fulfilled')
      .map((localization) => localization.value)
  );

  await ctx.cache.set(cacheKey, resolvedLocalizations, 60 * 30); // 30 minutos

  return { items: resolvedLocalizations };
}

module.exports = { getLocalizations };
