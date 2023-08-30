/** @type {import('moleculer').ServiceSchema} */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { getServiceModels } = require('../models');

module.exports = {
  name: 'assignables.assignableInstances',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    adminDashboard: {
      async handler(ctx) {
        // TODO Migrar
        return { instances: [] };
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
