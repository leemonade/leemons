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

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'deployment-manager',

  mixins: [
    LeemonsMongoDBMixin({
      models: {
        DeploymentPlugins: deploymentPluginsModel,
        DeploymentPluginsRelationship: deploymentPluginsRelationshipModel,
      },
    }),
  ],

  actions: {
    savePlugins: {
      async handler(ctx) {
        if (!ctx.meta.deploymentID) {
          throw new Error('Need ctx.meta.deploymentID');
        }
        return savePluginsToDeployment(ctx, ctx.params);
      },
    },
    savePluginsRelationships: {
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
  },

  created() {
    mongoose.connect(process.env.MONGO_URI);
  },

  events: {
    '$broker.started': function () {
      if (process.env.DISABLE_AUTO_INIT !== 'true') {
        autoInit(this.broker);
      }
    },
  },
});
