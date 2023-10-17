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
const restActions = require('./rest/group.rest');
const { addGroup, listGroups, duplicateGroup, addGroupIfNotExists } = require('../core/groups');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.groups',
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
    addGroup: {
      handler(ctx) {
        return addGroup({ ...ctx.params, ctx });
      },
    },
    listGroups: {
      handler(ctx) {
        return listGroups({ ...ctx.params, ctx });
      },
    },
    duplicateGroup: {
      handler(ctx) {
        return duplicateGroup({ ...ctx.params, ctx });
      },
    },
    addGroupIfNotExists: {
      handler(ctx) {
        return addGroupIfNotExists({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
