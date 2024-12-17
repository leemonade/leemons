const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');

const { PLUGIN_NAME, VERSION } = require('../config/constants');
const { getServiceModels } = require('../models');

const restActions = require('./rest/retakes.rest');

/** @type {import('moleculer').ServiceSchema} */
const retakesService = {
  name: `${PLUGIN_NAME}.retakes`,
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

module.exports = retakesService;
