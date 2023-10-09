/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');
const { getVersion, publishVersion } = require('../core/versionControl/versions');
const { create, remove, get, update } = require('../core/versionControl/currentVersions');
const upgradeVersion = require('../core/versionControl/versions/upgradeVersion');
const removeVersionService = require('../core/versionControl/versions/removeVersionService');
const list = require('../core/versionControl/currentVersions/list');
const listVersions = require('../core/versionControl/versions/listVersions');
const listVersionOfType = require('../core/versionControl/versions/listVersionOfType');
const {
  parseId,
  stringifyId,
  parseType,
  stringifyType,
  isValidVersion,
  parseVersion,
  stringifyVersion,
} = require('../core/versionControl/helpers');

/** @type {ServiceSchema} */
module.exports = {
  name: 'common.versionControl',
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
    register: {
      handler(ctx) {
        return create({ ...ctx.params, ctx });
      },
    },
    getCurrentVersion: {
      handler(ctx) {
        return get({ ...ctx.params, ctx });
      },
    },
    getVersion: {
      handler(ctx) {
        return getVersion({ ...ctx.params, ctx });
      },
    },
    list: {
      handler(ctx) {
        return list({ ...ctx.params, ctx });
      },
    },
    listVersions: {
      handler(ctx) {
        return listVersions({ ...ctx.params, ctx });
      },
    },
    listVersionsOfType: {
      handler(ctx) {
        return listVersionOfType({ ...ctx.params, ctx });
      },
    },
    publishVersion: {
      handler(ctx) {
        return publishVersion({ ...ctx.params, ctx });
      },
    },
    removeVersion: {
      handler(ctx) {
        return removeVersionService({ ...ctx.params, ctx });
      },
    },
    setCurrentVersion: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
      },
    },
    upgradeVersion: {
      handler(ctx) {
        return upgradeVersion({ ...ctx.params, ctx });
      },
    },
    unregister: {
      handler(ctx) {
        return remove({ ...ctx.params, ctx });
      },
    },
    parseId: {
      handler(ctx) {
        return parseId({ ...ctx.params, ctx });
      },
    },
    stringifyId: {
      handler(ctx) {
        return stringifyId({ ...ctx.params, ctx });
      },
    },
    parseType: {
      handler(ctx) {
        return parseType({ ...ctx.params, ctx });
      },
    },
    stringifyType: {
      handler(ctx) {
        return stringifyType({ ...ctx.params, ctx });
      },
    },
    isValidVersion: {
      handler(ctx) {
        return isValidVersion({ ...ctx.params, ctx });
      },
    },
    parseVersion: {
      handler(ctx) {
        return parseVersion({ ...ctx.params, ctx });
      },
    },
    stringifyVersion: {
      handler(ctx) {
        return stringifyVersion({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
};
