/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { LeemonsValidator } = require('@leemons/validator');
const { LeemonsError } = require('@leemons/error');
const _ = require('lodash');
const { getPluginNameWithVersionIfHaveFromServiceName } = require('@leemons/service-name-parser');
const { checkIfManualPasswordIsGood } = require('@leemons/deployment-manager');
const { updateDeploymentConfig } = require('../../core/deployments/updateDeploymentConfig');
const { addDeployment } = require('../../core/deployments/addDeployment');
const { isDomainInUse } = require('../../core/deployments/isDomainInUse');
const { reloadAllDeployments } = require('../../core/auto-init/reload-all-deployments');
const { getDeploymentInfo } = require('../../core/deployments/getDeploymentInfo');
/** @type {ServiceSchema} */
module.exports = {
  getConfigRest: {
    rest: {
      method: 'GET',
      path: '/config',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      let config = {};

      if (
        ctx.meta.deploymentID === 'auto-deployment-id' &&
        process.env.TEST_DEPLOYMENT_CONFIG === 'true'
      ) {
        config = {
          'v1.curriculum': {
            deny: {
              menu: ['curriculum', 'curriculum-new', 'curriculum-library'],
            },
          },
          'v1.academic-portfolio': {
            deny: {
              menu: ['welcome', 'profiles', 'programs'],
              others: [
                'subjectType',
                'classSeats',
                'treeProgramForm',
                'treeClassNameAndTypeFromForm',
                'treeClassSecondTeacherAndImageFromForm',
              ],
            },
            limits: {
              maxSubjects: 6,
            },
            defaults: {
              classSeats: 50,
            },
          },
          'v1.academic-calendar': {
            deny: {
              others: ['addRegionalCalendar'],
            },
          },
          'v1.fundae': {
            deny: {
              menu: ['fundae', 'fundae-list'],
            },
          },
          'v1.users': {
            deny: {
              menu: ['roles-list', 'profile-list', 'user-data'],
            },
          },
          'v1.families': {
            deny: {
              menu: ['families', 'families-data'],
            },
          },
          'v1.grades': {
            deny: {
              menu: ['rules', 'welcome', 'evaluations', 'promotions', 'dependencies'],
            },
          },
        };
      } else {
        const deployment = await ctx.db.Deployment.findOne(
          { id: ctx.meta.deploymentID },
          undefined,
          { disableAutoDeploy: true }
        ).lean();

        if (!deployment && process.env.DISABLE_AUTO_INIT === 'true')
          throw new LeemonsError(ctx, { message: 'Deployment not found at get config' });
        config = deployment?.config || {};
      }

      const callerPluginV = getPluginNameWithVersionIfHaveFromServiceName(ctx.caller);

      if (!ctx.params?.allConfig && config) {
        const keys = Object.keys(config);
        let result = null;
        _.forEach(keys, (key) => {
          if (ctx.params?.ignoreVersion) {
            if (key.split('.')[1] === callerPluginV.split('.')[1]) {
              result = config[key];
            }
          } else if (key === callerPluginV) {
            result = config[key];
          }
        });
        return result;
      }

      if (!config.helpdeskUrl && String(process.env.HELPDESK_URL).startsWith('http')) {
        config.helpdeskUrl = process.env.HELPDESK_URL;
      }

      return config;
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
  reloadAllDeploymentsRest: {
    dontCreateTransactionOnCallThisFunction: true,
    rest: {
      method: 'POST',
      path: '/reload-all-deployments',
    },
    async handler(ctx) {
      checkIfManualPasswordIsGood({ ctx });
      const { ids, reloadRelations } = ctx.params;
      const count = await reloadAllDeployments({ broker: this.broker, ids, reloadRelations });
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
      checkIfManualPasswordIsGood({ ctx });
      const { id } = ctx.params;
      return getDeploymentInfo({ id });
    },
  },
};
