/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const { add, update } = require('../core/roles');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.roles',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin,
  ],
  actions: {
    add: {
      handler(ctx) {
        return add({ ...ctx.params, ctx });
      },
    },
    update: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
