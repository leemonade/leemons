/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const _ = require('lodash');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { randomString } = require('@leemons/utils');
const { LeemonsError } = require('@leemons/error');
const { newTransaction } = require('@leemons/transactions');
const { deploymentPluginsModel } = require('../models/deployment-plugins');
const { deploymentPluginsRelationshipModel } = require('../models/deployment-plugins-relationship');
const { savePluginsToDeployment } = require('../core/deployment-plugins/savePluginsToDeployment');
const { autoInit } = require('../core/auto-init/auto-init');
const {
  savePluginsRelationshipsToDeployment,
} = require('../core/deployment-plugins-relationship/savePluginsRelationshipsToDeployment');
const {
  getGoodServiceActionToCall,
} = require('../core/deployment-plugins-relationship/getGoodServiceActionToCall');
const { canCallMe } = require('../core/deployment-plugins-relationship/canCallMe');
const { emit } = require('../core/events/emit');
const { isInstalled } = require('../core/deployment-plugins/isInstalled');
const restActions = require('./rest/deployment-manager.rest');
const { deploymentModel } = require('../models/deployment');
const { reloadAllDeployments } = require('../core/auto-init/reload-all-deployments');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'deployment-manager',

  mixins: [
    LeemonsMongoDBMixin({
      // Como deployment-manager ya se gestiona el mismo y no hace falta comprobar si el resto de plugins tienen acceso a llamarle no usamos el mixin
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
          throw new LeemonsError(ctx, { message: 'Need ctx.meta.deploymentID' });
        }
        return isInstalled({ ...ctx.params, ctx });
      },
    },
    savePlugins: {
      // TODO Proteger para que solo le pueda llamar la tienda o el mismo
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: 'Need ctx.meta.deploymentID' });
        }
        return savePluginsToDeployment(ctx, ctx.params);
      },
    },
    initDeployment: {
      // TODO Proteger para que solo le pueda llamar la tienda o el mismo
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: 'Need ctx.meta.deploymentID' });
        }
        // TODO: Crear transaccion
        ctx.meta.transactionID = await newTransaction(ctx);
        ctx.meta.initDeploymentProcessNumber = randomString();
        await ctx.call('deployment-manager.emit', {
          event: 'deployment-manager.install',
        });
        await ctx.call('deployment-manager.emit', {
          event: 'deployment-manager.finish',
        });
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
      // TODO Proteger para que solo le pueda llamar la tienda o el mismo
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: 'Need ctx.meta.deploymentID' });
        }
        return savePluginsRelationshipsToDeployment(ctx, ctx.params);
      },
    },
    getGoodActionToCall: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: 'Need ctx.meta.deploymentID' });
        }
        return getGoodServiceActionToCall(ctx);
      },
    },
    canCallMe: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: 'Need ctx.meta.deploymentID' });
        }
        return canCallMe(ctx);
      },
    },
    emit: {
      // TODO Proteger para que solo le pueda llamar la tienda o el mismo
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: 'Need ctx.meta.deploymentID' });
        }
        return emit(ctx);
      },
    },
    changeDeploymentDomains: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new LeemonsError(ctx, { message: 'Need ctx.meta.deploymentID' });
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
          throw new LeemonsError(ctx, { message: 'Need ctx.meta.deploymentID' });
        }
        return ctx.db.Deployment.findOne({ id: ctx.meta.deploymentID }, undefined, {
          disableAutoDeploy: true,
        }).lean();
      },
    },
  },

  created() {
    // mongoose.connect(process.env.MONGO_URI);
  },

  events: {
    '$broker.started': async function () {
      setTimeout(async () => {
        try {
          if (process.env.DISABLE_AUTO_INIT !== 'true') {
            console.info('- Auto init -');
            await autoInit(this.broker);
            console.info('- Auto init finished -');
          }
          if (process.env.RELOAD_ALL_DEPLOYMENTS_ON_INIT === 'true') {
            console.info('- Reload all deployments -');
            await reloadAllDeployments(this.broker);
            console.info('- Reload all deployments finished -');
          }
        } catch (e) {
          console.error('- Auto init error -', e);
        }
      }, 10000);
    },
  },
});
