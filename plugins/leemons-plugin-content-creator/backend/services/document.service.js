/** @type {import('moleculer').ServiceSchema} */

const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { getServiceModels } = require('../models');
const { pluginName } = require('../config/constants');
const restActions = require('./rest/document.rest');

module.exports = {
  name: `${pluginName}.document`,
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
  },

  // Esto debe eliminarse una vez hecho el merge a microservices/dev
  async created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
