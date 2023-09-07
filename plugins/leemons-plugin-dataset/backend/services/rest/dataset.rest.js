/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsValidator, localeRegexString } = require('leemons-validator');

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('leemons-middlewares');
const {
  getSchema,
  getSchemaWithLocale,
  saveField,
  saveMultipleFields,
  removeField,
} = require('../../core/datasetSchema');

const schemaConfig = {
  type: 'object',
  properties: {
    schema: {
      type: 'object',
      additionalProperties: true,
    },
    ui: {
      type: 'object',
      additionalProperties: true,
    },
  },
  required: ['schema', 'ui'],
};

/** @type {ServiceSchema} */
module.exports = {
  getSchemaRest: {
    rest: {
      method: 'POST',
      path: '/get-schema',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'dataset.dataset': {
            actions: ['view', 'update', 'create', 'delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          locationName: { type: 'string' },
          pluginName: { type: 'string' },
        },
        required: ['locationName', 'pluginName'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const dataset = await getSchema({ ...ctx.params, ctx });
        return { status: 200, dataset };
      }
      throw validator.error;
    },
  },
  getSchemaLocaleRest: {
    rest: {
      method: 'POST',
      path: '/get-schema-locale',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'dataset.dataset': {
            actions: ['view', 'update', 'create', 'delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          locationName: { type: 'string' },
          pluginName: { type: 'string' },
          locale: { type: 'string' },
        },
        required: ['locationName', 'pluginName'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        let { locale } = ctx.params;
        if (!locale) locale = await ctx.tx.call('users.platform.getDefaultLocale');
        // TODO Esto es "inseguro" ya que se le esta pasando el calledFrom
        const dataset = await getSchemaWithLocale({
          ...ctx.params,
          locale,
          ctx: { ...ctx, callerPlugin: ctx.params.pluginName },
        });
        return { status: 200, dataset };
      }
      throw validator.error;
    },
  },
  getSchemaFieldLocaleRest: {
    rest: {
      method: 'POST',
      path: '/get-schema-field-locale',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'dataset.dataset': {
            actions: ['view', 'update', 'create', 'delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          locationName: { type: 'string' },
          pluginName: { type: 'string' },
          locale: { type: 'string' },
          item: { type: 'string' },
        },
        required: ['locationName', 'pluginName', 'locale', 'item'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        // TODO Esto es "inseguro" ya que se le esta pasando el calledFrom

        const { compileJsonSchema, compileJsonUI } = await getSchemaWithLocale({
          ...ctx.params,
          defaultWithEmptyValues: true,
          ctx: { ...ctx, callerPlugin: ctx.params.pluginName },
        });
        return {
          status: 200,
          schema: compileJsonSchema.properties[ctx.params.item],
          ui: compileJsonUI[ctx.params.item],
        };
      }
      throw validator.error;
    },
  },
  saveFieldRest: {
    rest: {
      method: 'POST',
      path: '/save-field',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'dataset.dataset': {
            actions: ['update', 'create', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          locationName: { type: 'string' },
          pluginName: { type: 'string' },
          schemaConfig,
          schemaLocales: {
            type: 'object',
            patternProperties: {
              [localeRegexString]: schemaConfig,
            },
          },
          options: {
            type: 'object',
            properties: {
              useDefaultLocaleCallback: { type: 'boolean' },
            },
            additionalProperties: false,
          },
        },
        required: ['locationName', 'pluginName', 'schemaConfig', 'schemaLocales'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const dataset = await saveField({
          ...ctx.params,
          ...(ctx.params.options || {}),
          ctx,
        });
        return {
          status: 200,
          dataset,
        };
      }
      throw validator.error;
    },
  },
  saveMultipleFieldsRest: {
    rest: {
      method: 'POST',
      path: '/save-multiple-fields',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'dataset.dataset': {
            actions: ['update', 'create', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          locationName: { type: 'string' },
          pluginName: { type: 'string' },
          fields: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                schemaConfig,
                schemaLocales: {
                  type: 'object',
                  patternProperties: {
                    [localeRegexString]: schemaConfig,
                  },
                },
              },
              required: ['schemaConfig', 'schemaLocales'],
            },
          },
        },
        required: ['locationName', 'pluginName', 'fields'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const dataset = await saveMultipleFields({
          ...ctx.params,
          ctx,
        });
        return {
          status: 200,
          dataset,
        };
      }
      throw validator.error;
    },
  },
  removeFieldRest: {
    rest: {
      method: 'POST',
      path: '/remove-field',
    },
    middlewares: [
      LeemonsMiddlewareAuthenticated(),
      LeemonsMiddlewareNecessaryPermits({
        allowedPermissions: {
          'dataset.dataset': {
            actions: ['delete', 'admin'],
          },
        },
      }),
    ],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          locationName: { type: 'string' },
          pluginName: { type: 'string' },
          item: { type: 'string' },
        },
        required: ['locationName', 'pluginName', 'item'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const dataset = await removeField({
          ...ctx.params,
          ctx,
        });
        return {
          status: 200,
          dataset,
        };
      }
      throw validator.error;
    },
  },
};
