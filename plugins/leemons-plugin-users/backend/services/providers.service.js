const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { getProvidersActions } = require('@leemons/providers');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { PLUGIN_NAME, VERSION } = require('../config/constants');
const { getServiceModels } = require('../models');
const restActions = require('./rest/providers.rest');

/** @type {import('moleculer').ServiceSchema} */
module.exports = {
  name: `${PLUGIN_NAME}.providers`,
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
    ...getProvidersActions(),
  },
};
