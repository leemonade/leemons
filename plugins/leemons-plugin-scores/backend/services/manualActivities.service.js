const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');

const { PLUGIN_NAME, VERSION } = require('../config/constants');
const { getServiceModels } = require('../models');

const restActions = require('./rest/manualActivities.rest');

module.exports = {
  name: `${PLUGIN_NAME}.manualActivities`,
  version: VERSION,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
  },
};
