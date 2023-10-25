/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { pluginName } = require('../config/constants');
const { getServiceModels } = require('../models');
const restActions = require('./rest/files.rest');
const { uploadFromSource } = require('../core/files/helpers/uploadFromSource');
const { getByIds } = require('../core/files/getByIds');

/** @type {ServiceSchema} */
module.exports = {
  name: `${pluginName}.file`,
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
    upload: {
      handler(ctx) {
        return uploadFromSource({ ...ctx.params, ctx });
      },
    },
    getByIds: {
      handler(ctx) {
        return getByIds({ ...ctx.params, ctx });
      },
    },
  },
};
