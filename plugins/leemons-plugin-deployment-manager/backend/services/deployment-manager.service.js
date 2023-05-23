"use strict";

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const _ = require("lodash");
const mongoose = require("mongoose");
const { deploymentPluginsModel } = require("../models/deployment-plugins");
const {
  deploymentPluginsRelationshipModel,
} = require("../models/deployment-plugins-relationship");
const {
  savePluginsToDeployment,
} = require("../core/deployment-plugins/savePluginsToDeployment");
const { autoInit } = require("../core/auto-init/auto-init");

/** @type {ServiceSchema} */
module.exports = () => {
  return {
    name: "deployment-manager",

    mixins: [
      LeemonsMongoDBMixin({
        models: {
          DeploymentPlugins: deploymentPluginsModel,
          DeploymentPluginsRelationship: deploymentPluginsRelationshipModel,
        },
      }),
    ],

    actions: {
      addPlugins: {
        async handler(ctx) {
          if (!ctx.meta.deploymentID) {
            throw new Error("Need ctx.meta.deploymentID");
          }
          return savePluginsToDeployment(ctx, ctx.params);
        },
      },
    },

    created() {
      mongoose.connect(process.env.MONGO_URI);
    },

    async started() {
      if (process.env.DISABLE_AUTO_INIT !== "true") {
        autoInit(this.broker);
      }
    },
  };
};
