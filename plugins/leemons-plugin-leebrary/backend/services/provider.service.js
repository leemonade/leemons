/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { getProvidersActions } = require('leemons-providers');
const { getServiceModels } = require('../models');
const { listProviders } = require('../core/providers/list');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'leebrary.provider',
  version: 1,
  mixins: [
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...getProvidersActions(),
    list: {
      rest: {
        method: 'GET',
        path: '/list',
      },
      async handler(ctx) {
        const providers = await listProviders({ ctx });
        return { status: 200, providers };
      },
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
