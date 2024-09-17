/* eslint-disable no-console */
/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { validateInternalPrivateKey } = require('@leemons/deployment-manager');
const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');

const { reloadAllDeployments } = require('../../core/auto-init/reload-all-deployments');
const { addDeployment } = require('../../core/deployments/addDeployment');
const { addPluginsToDeployment } = require('../../core/deployments/addPluginsToDeployment');
const { getDeploymentConfig } = require('../../core/deployments/getDeploymentConfig');
const { getDeploymentInfo } = require('../../core/deployments/getDeploymentInfo');
const { isDomainInUse } = require('../../core/deployments/isDomainInUse');
const { updateDeploymentConfig } = require('../../core/deployments/updateDeploymentConfig');

/** @type {ServiceSchema} */
module.exports = {
  getConfigRest: {
    rest: {
      method: 'GET',
      path: '/config',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { allConfig, ignoreVersion } = ctx.params ?? {};

      return getDeploymentConfig({ ignoreVersion, allConfig, ctx });
    },
  },
  getDeploymentTypeRest: {
    rest: {
      method: 'GET',
      path: '/type',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const deployment = await ctx.db.Deployment.findOne({ id: ctx.meta.deploymentID }, undefined, {
        disableAutoDeploy: true,
      }).lean();
      return deployment.type;
    },
  },
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
  existDeploymentWithDomainRest: {
    dontCreateTransactionOnCallThisFunction: true,
    rest: {
      method: 'POST',
      path: '/is-domain-in-use',
    },
    async handler(ctx) {
      validateInternalPrivateKey({ ctx });
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          domain: { type: 'string' },
        },
        required: ['domain'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        return isDomainInUse({ ...ctx.params, ctx });
      }
      throw validator.error;
    },
  },
  changeDeploymentConfigRest: {
    dontCreateTransactionOnCallThisFunction: true,
    rest: {
      method: 'POST',
      path: '/change-deployment-config',
    },
    async handler(ctx) {
      validateInternalPrivateKey({ ctx });
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          domains: { type: 'array', minItems: 1, items: { type: 'string' } },
          deploymentID: { type: 'string' },
          config: { type: 'object' },
        },
        oneOf: [{ required: ['deploymentID'] }, { required: ['domains'] }],
        additionalProperties: false,
      });
      if (!validator.validate(ctx.params)) {
        throw validator.error;
      }
      return updateDeploymentConfig({ ...ctx.params, ctx });
    },
  },
  addManualDeploymentRest: {
    dontCreateTransactionOnCallThisFunction: true,
    rest: {
      method: 'POST',
      path: '/add-manual-deployment',
    },
    async handler(ctx) {
      validateInternalPrivateKey({ ctx });
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          domains: { type: 'array', minItems: 1, items: { type: 'string' } },
          plugins: { type: 'array', minItems: 2, items: { type: 'string' } },
          config: { type: 'object' },
        },
        required: ['name', 'type', 'domains', 'plugins'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        return addDeployment({ ctx, broker: this.broker, ...ctx.params });
      }
      throw validator.error;
    },
  },
  reloadAllDeploymentsRest: {
    dontCreateTransactionOnCallThisFunction: true,
    rest: {
      method: 'POST',
      path: '/reload-all-deployments',
    },
    async handler(ctx) {
      validateInternalPrivateKey({ ctx });
      const { ids, reloadRelations, includeAllPlugins } = ctx.params;
      const count = await reloadAllDeployments({
        broker: this.broker,
        ids,
        reloadRelations,
        includeAllPlugins,
      });
      return { count };
    },
  },
  deploymentInfoRest: {
    dontCreateTransactionOnCallThisFunction: true,
    rest: {
      method: 'POST',
      path: '/deployment-info',
    },
    async handler(ctx) {
      validateInternalPrivateKey({ ctx });
      const { id } = ctx.params;
      return getDeploymentInfo({ id });
    },
  },
  addPluginsToDeploymentRest: {
    dontCreateTransactionOnCallThisFunction: true,
    rest: {
      method: 'POST',
      path: '/deployments/:id/plugins',
    },
    params: {
      id: { type: 'string' },
      plugins: { type: 'array', items: { type: 'string' } },
    },
    async handler(ctx) {
      validateInternalPrivateKey({ ctx });
      const { id, plugins } = ctx.params;

      ctx.meta.deploymentID = id;

      return addPluginsToDeployment({ ctx, broker: this.broker, id, plugins });
    },
  },
};
