/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsError } = require('@leemons/error');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const _ = require('lodash');

const { autoInit } = require('../core/auto-init/auto-init');
const { reloadAllDeployments } = require('../core/auto-init/reload-all-deployments');
const { isInstalled } = require('../core/deployment-plugins/isInstalled');
const { savePluginsToDeployment } = require('../core/deployment-plugins/savePluginsToDeployment');
const { canCallMe } = require('../core/deployment-plugins-relationship/canCallMe');
const {
  getGoodServiceActionToCall,
} = require('../core/deployment-plugins-relationship/getGoodServiceActionToCall');
const {
  savePluginsRelationshipsToDeployment,
} = require('../core/deployment-plugins-relationship/savePluginsRelationshipsToDeployment');
const { initDeployment } = require('../core/deployments/initDeployment');
const { emit } = require('../core/events/emit');
const { deploymentModel } = require('../models/deployment');
const { deploymentPluginsModel } = require('../models/deployment-plugins');
const { deploymentPluginsRelationshipModel } = require('../models/deployment-plugins-relationship');

const restActions = require('./rest/deployment-manager.rest');

const CTX_META_DEPLOYMENT_ID_ERROR = 'Need ctx.meta.deploymentID';

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'deployment-manager',

  mixins: [
    LeemonsMongoDBMixin({
      // Since the deployment-manager manages itself and there is no need to check if the other plugins have access to call it, we do not use the mixin.
      forceLeemonsDeploymentManagerMixinNeedToBeImported: false,
      models: {
        Deployment: deploymentModel,
        DeploymentPlugins: deploymentPluginsModel,
        DeploymentPluginsRelationship: deploymentPluginsRelationshipModel,
      },
    }),
  ],
  actions: {
    ...restActions,
    getDeploymentIDByDomain: {
      dontCreateTransactionOnCallThisFunction: true,
      async handler(ctx) {
        if (!ctx.meta.hostname) {
          throw new LeemonsError(ctx, { message: 'hostname not found' });
        }
        const deployment = await ctx.db.Deployment.findOne(
          { domains: ctx.meta.hostname },
          undefined,
          { disableAutoDeploy: true }
        ).lean();
        return deployment ? deployment.id : null;
      },
    },
    pluginIsInstalled: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: CTX_META_DEPLOYMENT_ID_ERROR });
        }
        return isInstalled({ ...ctx.params, ctx });
      },
    },
    savePlugins: {
      // TODO Protect so that only the external "service-catalog" or itself can call it
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: CTX_META_DEPLOYMENT_ID_ERROR });
        }
        return savePluginsToDeployment(ctx, ctx.params);
      },
    },
    initDeployment: {
      // TODO Protect so that only the external "service-catalog" or itself can call it
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: CTX_META_DEPLOYMENT_ID_ERROR });
        }

        const { pluginNames, relationship } = ctx.params ?? {};

        await initDeployment({ ctx, pluginNames, relationship });
      },
    },
    getAllDeploymentIds: {
      dontCreateTransactionOnCallThisFunction: true,
      async handler() {
        const deployments = await deploymentModel.find({}).select(['id']).lean();
        return _.map(deployments, 'id');
      },
    },
    savePluginsRelationships: {
      // TODO Protect so that only the external "client-manager" or itself can call it
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: CTX_META_DEPLOYMENT_ID_ERROR });
        }
        return savePluginsRelationshipsToDeployment(ctx, ctx.params);
      },
    },
    getGoodActionToCall: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: CTX_META_DEPLOYMENT_ID_ERROR });
        }
        return getGoodServiceActionToCall(ctx);
      },
    },
    canCallMe: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: CTX_META_DEPLOYMENT_ID_ERROR });
        }
        return canCallMe(ctx);
      },
    },
    emit: {
      // TODO Protect so that only the external "client-manager" or itself can call it
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: CTX_META_DEPLOYMENT_ID_ERROR });
        }
        return emit(ctx);
      },
    },
    changeDeploymentDomains: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: CTX_META_DEPLOYMENT_ID_ERROR });
        }
        if (!ctx.params.domains) {
          throw new LeemonsError(ctx, { message: 'Need ctx.params.domains' });
        }
        const domains = _.map(ctx.params.domains, (domain) => new URL(domain).hostname);
        return ctx.db.Deployment.findOneAndUpdate(
          { id: ctx.meta.deploymentID },
          { domains },
          { disableAutoDeploy: true }
        );
      },
    },
    getDeployment: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: CTX_META_DEPLOYMENT_ID_ERROR });
        }

        const deployment = await ctx.db.Deployment.findOne(
          { id: ctx.meta.deploymentID },
          undefined,
          {
            disableAutoDeploy: true,
          }
        ).lean();

        if (deployment) {
          deployment.type = deployment.type ?? 'free';
        }
        return deployment;
      },
    },
  },
  events: {
    '$broker.started': async function () {
      setTimeout(async () => {
        try {
          if (process.env.DISABLE_AUTO_INIT !== 'true') {
            this.logger.info('- Auto init -');
            await autoInit(this.broker);
            this.logger.info('- Auto init finished -');
          }
          if (process.env.RELOAD_ALL_DEPLOYMENTS_ON_INIT === 'true') {
            this.logger.info('- Reload all deployments -');
            await reloadAllDeployments({
              broker: this.broker,
              reloadRelations: String(process.env.RELOAD_ALL_RELATIONS_ON_INIT) === 'true',
            });
            this.logger.info('- Reload all deployments finished -');
          }
        } catch (e) {
          this.logger.error('- Auto init error -', e);
        }
      }, 10000);
    },
  },
});
