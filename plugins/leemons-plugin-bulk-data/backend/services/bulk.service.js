const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { pluginName } = require('../config/constants');
const restActions = require('./rest/bulk.rest');

module.exports = {
  name: `${pluginName}.bulk`,
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMQTTMixin(),
    LeemonsDeploymentManagerMixin(),
  ],
  actions: {
    ...restActions,
  },
};
