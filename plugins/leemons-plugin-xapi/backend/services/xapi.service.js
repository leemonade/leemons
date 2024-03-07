/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');
const restActions = require('./rest/xapi.rest');
const { add } = require('../core/xapi/statement');

/** @type {ServiceSchema} */
module.exports = {
  name: 'xapi.xapi',
  version: 1,
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
  },

  created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
