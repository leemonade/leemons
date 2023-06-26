/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const _ = require('lodash');
const mongoose = require('mongoose');
const { LeemonsMongoDBMixin } = require('leemons-mongodb');
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

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'deployment-manager',

  mixins: [
    LeemonsMongoDBMixin({
      // Como deployment-manager ya se gestiona el mismo y no hace falta comprobar si el resto de plugins tienen acceso a llamarle no usamos el mixin
      forceLeemonsDeploymentManagerMixinNeedToBeImported: false,
      models: {
        DeploymentPlugins: deploymentPluginsModel,
        DeploymentPluginsRelationship: deploymentPluginsRelationshipModel,
      },
    }),
  ],

  actions: {
    savePlugins: {
      // TODO Proteger para que solo le pueda llamar la tienda o el mismo
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        return savePluginsToDeployment(ctx, ctx.params);
      },
    },
    initDeployment: {
      // TODO Proteger para que solo le pueda llamar la tienda o el mismo
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        return ctx.call('deployment-manager.emit', {
          event: 'deployment-manager.install',
        });
      },
    },
    savePluginsRelationships: {
      // TODO Proteger para que solo le pueda llamar la tienda o el mismo
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        return savePluginsRelationshipsToDeployment(ctx, ctx.params);
      },
    },
    getGoodActionToCall: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        return getGoodServiceActionToCall(ctx);
      },
    },
    canCallMe: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        return canCallMe(ctx);
      },
    },
    emit: {
      // TODO Proteger para que solo le pueda llamar la tienda o el mismo
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        return emit(ctx);
      },
    },
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },

  events: {
    '$broker.started': async function () {
      if (process.env.DISABLE_AUTO_INIT !== 'true') {
        await autoInit(this.broker);
        console.info('- Auto init finished -');
      }
    },
  },
});
