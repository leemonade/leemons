/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { getProvidersActions } = require('@leemons/providers');
const { getServiceModels } = require('../models');
const { pluginName } = require('../config/constants');
const restActions = require('./rest/permissions.rest');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: `${pluginName}.provider`,
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
    ...getProvidersActions(),
    ...restActions,
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
