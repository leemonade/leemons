/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const restActions = require('./rest/group.rest');
// const { addGroup, listGroups, duplicateGroup, addGroupIfNotExists } = require('../core/groups');
const { addGroup } = require('../core/groups/addGroup');
const { listGroups } = require('../core/groups/listGroups');
const { duplicateGroup } = require('../core/groups/duplicateGroup');
const { addGroupIfNotExists } = require('../core/groups/addGroupIfNotExists');

/** @type {ServiceSchema} */
module.exports = {
  name: 'academic-portfolio.programs',
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
    mongoose.connect(process.env.MONGO_URI);
  },
};
