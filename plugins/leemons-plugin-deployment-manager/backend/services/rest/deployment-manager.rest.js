/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');
const { LeemonsError } = require('@leemons/error');
const { checkIfManualPasswordIsGood } = require('../../helpers/checkIfManualPasswordIsGood');
const { updateDeploymentConfig } = require('../../core/deployments/updateDeploymentConfig');
const { addDeployment } = require('../../core/deployments/addDeployment');
const { isDomainInUse } = require('../../core/deployments/isDomainInUse');
/** @type {ServiceSchema} */
module.exports = {
  getConfigRest: {
    rest: {
      method: 'GET',
      path: '/config',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const deployment = await ctx.db.Deployment.findOne({ id: ctx.meta.deploymentID }).lean();
      if (!deployment)
        throw new LeemonsError(ctx, { message: 'Deployment not found at get config' });
      return deployment.config;
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
      checkIfManualPasswordIsGood({ ctx });
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
      checkIfManualPasswordIsGood({ ctx });
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
      if (validator.validate(ctx.params)) {
        await updateDeploymentConfig({ ...ctx.params, ctx });
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
      checkIfManualPasswordIsGood({ ctx });
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          name: { type: 'string' },
          domains: { type: 'array', minItems: 1, items: { type: 'string' } },
          plugins: { type: 'array', minItems: 2, items: { type: 'string' } },
          config: { type: 'object' },
        },
        required: ['name', 'domains', 'plugins'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params)) {
        return addDeployment({ ctx, broker: this.broker, ...ctx.params });
      }
      throw validator.error;
    },
  },
};
