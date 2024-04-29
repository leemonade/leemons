/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');

const getDatasetFormRest = require('./openapi/emergencyPhones/getDatasetFormRest');
/** @type {ServiceSchema} */
module.exports = {
  getDatasetFormRest: {
    openapi: getDatasetFormRest.openapi,
    rest: {
      method: 'GET',
      path: '/dataset-form',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'families-emergency-numbers.families-emergency-numbers': {
            actions: ['admin', 'view', 'update', 'create'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const { compileJsonSchema, compileJsonUI } = await ctx.tx.call(
        'dataset.dataset.getSchemaWithLocale',
        {
          locationName: `families-emergency-numbers-data`,
          pluginName: 'families-emergency-numbers',
          locale: ctx.meta.userSession.locale,
        }
      );
      return {
        status: 200,
        jsonSchema: compileJsonSchema,
        jsonUI: compileJsonUI,
      };
    },
  },
};
