const { LeemonsError } = require('@leemons/error');
const { LeemonsValidator } = require('@leemons/validator');
const { cloneDeep } = require('lodash');

function getAddCustomTranslationKeysAction({ middlewares } = {}) {
  return {
    addCustomTranslationKeys: {
      rest: {
        method: 'POST',
        path: '/custom-keys',
      },
      middlewares,
      async handler(ctx) {
        const validator = new LeemonsValidator({
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            prefix: {
              type: 'string',
            },
            localizations: {
              type: 'object',
              properties: {
                en: { type: 'object', additionalProperties: true }, // { key1: 'value1', key2: 'value2' }
                es: { type: 'object', additionalProperties: true }, // { key1: 'value1', key2: 'value2' }
              },
              additionalProperties: true,
            },
          },
          required: ['localizations', 'id', 'prefix'],
          additionalProperties: false,
        });
        if (validator.validate(ctx.params)) {
          const { id, prefix, localizations } = ctx.params;
          const localizationsToSave = cloneDeep(localizations);

          Object.keys(localizationsToSave).forEach((language) => {
            Object.keys(localizationsToSave[language]).forEach((key) => {
              const newKey = `${prefix}.${id}.${key}`;
              localizationsToSave[language][newKey] = localizationsToSave[language][key];
              delete localizationsToSave[language][key];
            });
          });

          const data = await ctx.tx.call('multilanguage.contents.setManyByJSON', {
            data: localizationsToSave,
          });
          return { status: 200, data };
        }

        throw new LeemonsError(ctx, { message: validator.error, httpStatusCode: 400 });
      },
    },
  };
}

module.exports = { getAddCustomTranslationKeysAction };
