/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { PLUGIN_NAME, VERSION } = require('../config/constants');
const { add } = require('../core/xapi/statement');
const { getServiceModels } = require('../models');

const restActions = require('./rest/xapi.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: `${PLUGIN_NAME}.xapi`,
  version: VERSION,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],

  actions: {
    ...restActions,
    find: {
      async handler(ctx) {
        const query = ctx.tx.db.Statement.find(ctx.params.query);
        if (ctx.params.sort) {
          query.sort(ctx.params.sort);
        }
        return query.lean();
      },
    },
    addStatement: {
      async handler(ctx) {
        return add({ ...ctx.params, ctx });
      },
    },
    addLearningStatement: {
      async handler(ctx) {
        return add({ ...ctx.params.statement, ...ctx.params.config, type: 'learning', ctx });
      },
    },
    addLogStatement: {
      async handler(ctx) {
        return add({ ...ctx.params.statement, ...ctx.params.config, type: 'log', ctx });
      },
    },
    aggregate: {
      async handler(ctx) {
        const { deploymentID } = ctx.meta;
        const { pipeline } = ctx.params;

        // Find the $match stage and replace the deploymentID
        const matchStage = pipeline.find((stage) => stage.$match);
        if (matchStage) {
          matchStage.$match.deploymentID = deploymentID;
        } else {
          pipeline.unshift({ $match: { deploymentID } });
        }

        return ctx.tx.db.Statement.aggregate(pipeline);
      },
    },
  },
};
