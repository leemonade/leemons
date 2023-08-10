/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const {
  onBeforeRemoveProgram,
  offBeforeRemoveProgram,
  onAfterRemoveProgram,
  offAfterRemoveProgram,
} = require('../core/callbacks');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.callbacks',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    onBeforeRemoveProgram: {
      handler(ctx) {
        onBeforeRemoveProgram({ ...ctx.params, ctx });
      },
    },
    offBeforeRemoveProgram: {
      handler(ctx) {
        offBeforeRemoveProgram({ ...ctx.params, ctx });
      },
    },
    onAfterRemoveProgram: {
      handler(ctx) {
        onAfterRemoveProgram({ ...ctx.params, ctx });
      },
    },
    offAfterRemoveProgram: {
      handler(ctx) {
        offAfterRemoveProgram({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
