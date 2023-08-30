/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./rest/common.rest');
const { getTreeNodes } = require('../core/common/getTreeNodes');
const { adminDashboard } = require('../core/common/adminDashboard');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.common',
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
    ...restActions,
    getTreeNodes: {
      handler(ctx) {
        return getTreeNodes({ ...ctx.params, ctx });
      },
    },
    adminDashboard: {
      handler(ctx) {
        return adminDashboard({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
