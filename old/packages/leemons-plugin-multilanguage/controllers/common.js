const _ = require('lodash');

// TODO: Add locale fallback
async function get(ctx) {
  const { keys = null, keysStartsWith = null, locale } = ctx.request.body;

  const { LeemonsValidator } = global.utils;

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
  if (!validator.validate(ctx.request.body)) {
    ctx.status = 400;
    ctx.body = { status: 400, error: validator.error };
    return;
  }

  const cacheKey = `multilanguage:common:get:${JSON.stringify({ keys, locale, keysStartsWith })}`;
  const cache = await leemons.cache.get(cacheKey);

  if (cache) {
    // TODO: Ver por que peta lo cacheado en la pagina de http://localhost:8080/private/dashboard/class/2dd89ae1-a795-402c-808c-9951f130f51a?type=all&sort=assignation&query=&progress=all
    ctx.status = 200;
    ctx.body = { items: cache };
  } else {
    const localizationsService = leemons.plugin.services.common.getProvider();

    try {
      const localizations = [];

      // Get localizations by key
      if (keys) {
        localizations.push(localizationsService.getManyWithLocale(keys, locale));
      }
      // Get localizations which starts by key
      if (keysStartsWith) {
        localizations.push(
          ...keysStartsWith.map((key) =>
            localizationsService.getKeyStartsWith(key, locale).then((_localizations) =>
              // Return in object format: { key: 'value' }
              _.fromPairs(
                _localizations.map((localization) => [localization.key, localization.value])
              )
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

      await leemons.cache.set(cacheKey, resolvedLocalizations, 60 * 30); // 30 minutos
      ctx.status = 200;
      ctx.body = { items: resolvedLocalizations };
    } catch (e) {
      ctx.status = 400;
      ctx.body = { status: 400, error: e.message };
    }
  }
}

async function getLogged(ctx) {
  const localeService = leemons.plugin.services.locales.getProvider();
  ctx.request.body.locale = await localeService.resolveLocales(ctx.state.userSession);
  await get(ctx);
}

module.exports = {
  get,
  getLogged,
};
