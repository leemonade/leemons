/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');
const { validateInternalPrivateKey } = require('@leemons/deployment-manager');
const {
  updateDeploymentConfig,
} = require('../../core/deployments/updateDeploymentConfig');
const { addDeployment } = require('../../core/deployments/addDeployment');
const { isDomainInUse } = require('../../core/deployments/isDomainInUse');
const {
  reloadAllDeployments,
} = require('../../core/auto-init/reload-all-deployments');
const {
  getDeploymentInfo,
} = require('../../core/deployments/getDeploymentInfo');
const {
  getDeploymentConfig,
} = require('../../core/deployments/getDeploymentConfig');

const getConfigRest = require('./openapi/deployment-manager/getConfigRest');
const getDeploymentTypeRest = require('./openapi/deployment-manager/getDeploymentTypeRest');
const infoRest = require('./openapi/deployment-manager/infoRest');
const existDeploymentWithDomainRest = require('./openapi/deployment-manager/existDeploymentWithDomainRest');
const changeDeploymentConfigRest = require('./openapi/deployment-manager/changeDeploymentConfigRest');
const addManualDeploymentRest = require('./openapi/deployment-manager/addManualDeploymentRest');
const reloadAllDeploymentsRest = require('./openapi/deployment-manager/reloadAllDeploymentsRest');
const deploymentInfoRest = require('./openapi/deployment-manager/deploymentInfoRest');
/** @type {ServiceSchema} */
module.exports = {
  getConfigRest: {
    openapi: getConfigRest.openapi,
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
    openapi: getDeploymentTypeRest.openapi,
    rest: {
      method: 'GET',
      path: '/type',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const deployment = await ctx.db.Deployment.findOne(
        { id: ctx.meta.deploymentID },
        undefined,
        {
          disableAutoDeploy: true,
        }
      ).lean();
      return deployment.type;
    },
  },
  infoRest: {
    openapi: infoRest.openapi,
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
        const plugin = await ctx.db.DeploymentPlugins.findOne({
          pluginName,
        }).lean();
        if (plugin)
          return { name: plugin.pluginName, version: plugin.pluginVersion };
        return null;
      }
      throw validator.error;
    },
  },
  existDeploymentWithDomainRest: {
    openapi: existDeploymentWithDomainRest.openapi,
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
    openapi: changeDeploymentConfigRest.openapi,
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
    openapi: addManualDeploymentRest.openapi,
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
    openapi: reloadAllDeploymentsRest.openapi,
    dontCreateTransactionOnCallThisFunction: true,
    rest: {
      method: 'POST',
      path: '/reload-all-deployments',
    },
    async handler(ctx) {
      validateInternalPrivateKey({ ctx });
      const { ids, reloadRelations } = ctx.params;
      const count = await reloadAllDeployments({
        broker: this.broker,
        ids,
        reloadRelations,
      });
      return { count };
    },
  },
  deploymentInfoRest: {
    openapi: deploymentInfoRest.openapi,
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
};
