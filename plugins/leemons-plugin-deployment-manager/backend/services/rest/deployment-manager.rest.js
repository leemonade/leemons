/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const url = require('url');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');
const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const { isCoreService } = require('@leemons/deployment-manager');
const {
  getPluginNameFromServiceName,
  getPluginNameWithVersionIfHaveFromServiceName,
  getPluginVersionFromServiceName,
} = require('@leemons/service-name-parser');
const { newTransaction, addTransactionState } = require('@leemons/transactions');
const { ObjectId } = require('mongodb');

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
  addManualDeploymentRest: {
    dontCreateTransactionOnCallThisFunction: true,
    rest: {
      method: 'POST',
      path: '/add-manual-deployment',
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
        required: ['name', 'domains', 'plugins', 'password'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        if (!process.env.MANUAL_PASSWORD) {
          throw new LeemonsError(ctx, {
            message:
              'Disabled by default specify process.env.MANUAL_PASSWORD to be able to use it.',
          });
        }
        if (ctx.params.password === process.env.MANUAL_PASSWORD) {
          const domains = _.map(ctx.params.domains, (domain) => new URL(domain).hostname);

          const servicesRaw = await this.broker.call('$node.services', {
            withActions: true,
            withEvents: true,
          });
          const servicesByVersionAndName = {};
          _.forEach(servicesRaw, (serviceRaw) => {
            const serviceNameWithVersionIfHave = getPluginNameWithVersionIfHaveFromServiceName(
              serviceRaw.fullName
            );
            // eslint-disable-next-line no-prototype-builtins
            if (!servicesByVersionAndName.hasOwnProperty(serviceNameWithVersionIfHave)) {
              servicesByVersionAndName[serviceNameWithVersionIfHave] = {
                actions: [],
                events: [],
              };
            }
            servicesByVersionAndName[serviceNameWithVersionIfHave].actions.push(
              ...Object.keys(serviceRaw.actions)
            );
            servicesByVersionAndName[serviceNameWithVersionIfHave].events.push(
              ...Object.keys(serviceRaw.events)
            );
          });

          const pluginNames = [];
          const relationship = [];
          _.forEach(ctx.params.plugins, (fromPluginName) => {
            // eslint-disable-next-line no-prototype-builtins
            if (!servicesByVersionAndName.hasOwnProperty(fromPluginName)) {
              throw new LeemonsError(ctx, {
                message: `Plugin name (${fromPluginName}) not found`,
              });
            }
            pluginNames.push(getPluginNameFromServiceName(fromPluginName));
            _.forEach(ctx.params.plugins, (toPluginName) => {
              // eslint-disable-next-line no-prototype-builtins
              if (!servicesByVersionAndName.hasOwnProperty(toPluginName)) {
                throw new LeemonsError(ctx, {
                  message: `Plugin name (${toPluginName}) not found`,
                });
              }
              relationship.push({
                fromPluginName: getPluginNameFromServiceName(fromPluginName),
                toPluginName: getPluginNameFromServiceName(toPluginName),
                actions: servicesByVersionAndName[toPluginName].actions,
                events: servicesByVersionAndName[toPluginName].events,
              });
            });
          });

          const domainAlreadyUsed = await ctx.db.Deployment.findOne(
            {
              domains: { $in: domains },
            },
            undefined,
            { disableAutoDeploy: true }
          )
            .select(['id'])
            .lean();
          if (domainAlreadyUsed)
            throw new LeemonsError(ctx, { message: 'One of this domains already in use' });

          let [deployment] = await ctx.db.Deployment.create(
            [
              {
                id: new ObjectId().toString(),
                name: ctx.params.name,
                domains,
              },
            ],
            { disableAutoDeploy: true, disableAutoLRN: true }
          );
          deployment = deployment.toObject();

          ctx.meta.deploymentID = deployment.id;
          ctx.meta.transactionID = await newTransaction(ctx);

          await addTransactionState(ctx, {
            action: 'leemonsMongoDBRollback',
            payload: {
              modelKey: 'Deployment',
              action: 'removeMany',
              data: [deployment.id],
            },
          });

          await ctx.tx.call(
            'deployment-manager.savePlugins',
            _.map(_.uniq(pluginNames), (pluginName) => ({
              pluginName,
              pluginVersion: getPluginVersionFromServiceName(pluginName) || 1,
            }))
          );
          // We simulate that the store adds the permissions between the actions of the
          await ctx.tx.call('deployment-manager.savePluginsRelationships', relationship);
          // We simulate that the store tells us to start this deploymentID.
          await ctx.tx.call('deployment-manager.initDeployment', relationship);
          return { deployment };
        }
        throw new LeemonsError(ctx, {
          message: 'Bad password',
        });
      }
      throw validator.error;
    },
  },
};
