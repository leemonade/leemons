/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');
const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const { isCoreService } = require('@leemons/deployment-manager');
const { getPluginNameFromServiceName } = require('@leemons/service-name-parser');

/** @type {ServiceSchema} */
module.exports = {
  infoRest: {
    rest: {
      method: 'POST',
      path: '/info',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        const pluginName = ctx.params.name.replace('leemons-plugin-', '');
        const plugin = await ctx.db.DeploymentPlugins.findOne({ pluginName }).lean();
        if (plugin) return { name: plugin.pluginName, version: plugin.pluginVersion };
        return null;
      }
      throw validator.error;
    },
  },
  addManualDeployment: {
    rest: {
      method: 'POST',
      path: '/info',
    },
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          password: { type: 'string' },
          name: { type: 'string' },
          domains: { type: 'array', minItems: 1, items: { type: 'string' } },
          plugins: { type: 'array', minItems: 2, items: { type: 'string' } },
        },
        required: ['name', 'domains', 'plugins'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        if (!process.env.MANUAL_PASSWORD) {
          throw LeemonsError(ctx, {
            message:
              'Disabled by default specify process.env.MANUAL_PASSWORD to be able to use it.',
          });
        }
        if (ctx.params.password === process.env.MANUAL_PASSWORD) {
          _.forEach(plugins, (fromService) => {
            if (!isCoreService(fromService.name)) {
              const fromPluginName = getPluginNameFromServiceName(fromService.name);
              pluginNames.push(fromPluginName);
              _.forEach(broker.services, (toService) => {
                if (!isCoreService(toService.name)) {
                  const toPluginName = getPluginNameFromServiceName(toService.name);
                  const actions = [];
                  const events = [];
                  _.forIn(toService.actions, (value, key) => {
                    actions.push(`${toService.fullName}.${key}`);
                  });
                  _.forIn(toService.events, (value, key) => {
                    if (!key.includes('*')) {
                      events.push(key);
                    } else {
                      console.warn('Wilcards in events not allowed');
                    }
                  });
                  let index = _.findIndex(relationship, { fromPluginName, toPluginName });
                  if (index < 0) {
                    relationship.push({
                      fromPluginName,
                      toPluginName,
                      actions: [],
                      events: [],
                    });
                    index = relationship.length - 1;
                  }
                  relationship[index].actions.push(...actions);
                  relationship[index].events.push(...events);
                }
              });
            }
          });
        }
        throw LeemonsError(ctx, {
          message: 'Bad password',
        });
      }
      throw validator.error;
    },
  },
};
