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
    ctx.body = { error: validator.error };
    return;
  }

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

    ctx.body = { items: resolvedLocalizations };
  } catch (e) {
    ctx.body = { error: e.message };
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
