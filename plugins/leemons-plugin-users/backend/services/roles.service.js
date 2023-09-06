/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const _ = require('lodash');
const { LeemonsMQTTMixin } = require('leemons-mqtt');
const {
  add,
  update,
  addPermissionMany,
  removePermissionsByName,
  getRoleProfile,
} = require('../core/roles');
const { getServiceModels } = require('../models');
const restActions = require('./rest/roles.rest');
const { validatePermissionName } = require('../validations/exists');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.roles',
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
    add: {
      handler(ctx) {
        return add({ ...ctx.params, ctx });
      },
    },
    update: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
      },
    },
    addPermissionMany: {
      handler(ctx) {
        if (ctx.callerPlugin !== 'users') {
          _.forEach(ctx.params.permissions, (permission) => {
            validatePermissionName(permission.permissionName, ctx.callerPlugin);
          });
        }
        return addPermissionMany({ ...ctx.params, ctx });
      },
    },
    removePermissionsByName: {
      handler(ctx) {
        return removePermissionsByName({ ...ctx.params, ctx });
      },
    },
    getRoleProfile: {
      handler(ctx) {
        return getRoleProfile({ ...ctx.params, ctx });
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
