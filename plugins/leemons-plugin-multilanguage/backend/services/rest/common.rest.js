/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { LeemonsValidator } = require('leemons-validator');
const _ = require('lodash');
const { LeemonsMiddlewareAuthenticated } = require('leemons-middlewares');
const { getManyWithLocale, getKeyStartsWith } = require('../../core/localization');
const { resolveLocales } = require('../../core/locale');

async function get({ ctx }) {
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
    ctx.meta.$statusCode = 400;
    return { status: 400, error: validator.error };
  }

  const cacheKey = `multilanguage:common:get:${JSON.stringify({
    keys,
    locale,
    keysStartsWith,
  })}`;
  const cache = await ctx.cache.get(cacheKey);

  if (cache) {
    // TODO: Ver por que peta lo cacheado en la pagina de http://localhost:8080/private/dashboard/class/2dd89ae1-a795-402c-808c-9951f130f51a?type=all&sort=assignation&query=&progress=all
    // return { items: cache };
  }
  const localizations = [];

  // Get localizations by key
  if (keys) {
    localizations.push(
      getManyWithLocale({
        //! TODO USANDO EL FRONTEND VIEJO QUITAMOS PLUGINS. UNA VEZ MIGRADO SE PUEDE QUITAR EL REPLACE
        keys: _.map(keys, (key) => key.replace('plugins.', '').replace('providers.', '')),
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
        //! TODO USANDO EL FRONTEND VIEJO QUITAMOS PLUGINS. UNA VEZ MIGRADO SE PUEDE QUITAR EL REPLACE
        getKeyStartsWith({
          key: key.replace('plugins.', '').replace('providers.', ''),
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

  //! TODO BORRAR ESTO CUANDO SOBRE LO DE PLUGINS. EN EL FRONTEND
  _.forIn(resolvedLocalizations, (value, key) => {
    resolvedLocalizations[`plugins.${key}`] = value;
    resolvedLocalizations[`providers.${key}`] = value;
    delete resolvedLocalizations[key];
  });
  //! -----

  await ctx.cache.set(cacheKey, resolvedLocalizations, 60 * 30); // 30 minutos

  return { items: resolvedLocalizations };
}

module.exports = {
  getLoggedRest: {
    rest: {
      method: 'POST',
      path: '/logged',
    },
    middlewares: [LeemonsMiddlewareAuthenticated({ continueEvenThoughYouAreNotLoggedIn: true })],
    async handler(ctx) {
      ctx.params.locale = await resolveLocales({ ctx });
      return get({ ctx });
    },
  },
  getRest: {
    rest: {
      method: 'POST',
      path: '/',
    },
    async handler(ctx) {
      return get({ ctx });
    },
  },
};
