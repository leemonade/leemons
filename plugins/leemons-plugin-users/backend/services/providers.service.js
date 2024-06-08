const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { getProvidersActions } = require('@leemons/providers');
const { PLUGIN_NAME, VERSION } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {import('moleculer').ServiceSchema} */
module.exports = {
  name: `${PLUGIN_NAME}.providers`,
  version: VERSION,
  mixins: [
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...getProvidersActions(),
  },
};
