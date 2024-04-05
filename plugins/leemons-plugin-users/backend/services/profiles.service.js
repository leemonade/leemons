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
const {
  add,
  list,
  update,
  existName,
  detailByUri,
  saveBySysName,
  detailBySysName,
  getProfileSysName,
  addProfileContact,
  getProfileContacts,
  addCustomPermissions,
  removeCustomPermissionsByName,
  getRoleForRelationshipProfileCenter,
  existMany,
} = require('../core/profiles');
const restActions = require('./rest/profiles.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.profiles',
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
    list: {
      handler(ctx) {
        return list({ ...ctx.params, ctx });
      },
    },
    update: {
      handler(ctx) {
        return update({ ...ctx.params, ctx });
      },
    },
    existName: {
      handler(ctx) {
        return existName({ ...ctx.params, ctx });
      },
    },
    existMany: {
      handler(ctx) {
        return existMany({ ...ctx.params, ctx });
      },
    },
    detailByUri: {
      handler(ctx) {
        return detailByUri({ ...ctx.params, ctx });
      },
    },
    saveBySysName: {
      handler(ctx) {
        return saveBySysName({ ...ctx.params, ctx });
      },
    },
    detailBySysName: {
      handler(ctx) {
        return detailBySysName({ ...ctx.params, ctx });
      },
    },
    getProfileSysName: {
      handler(ctx) {
        return getProfileSysName({ ...ctx.params, ctx });
      },
    },
    addProfileContact: {
      handler(ctx) {
        return addProfileContact({ ...ctx.params, ctx });
      },
    },
    getProfileContacts: {
      handler(ctx) {
        return getProfileContacts({ ...ctx.params, ctx });
      },
    },
    addCustomPermissions: {
      handler(ctx) {
        return addCustomPermissions({ ...ctx.params, ctx });
      },
    },
    removeCustomPermissionsByName: {
      handler(ctx) {
        return removeCustomPermissionsByName({ ...ctx.params, ctx });
      },
    },
    getRoleForRelationshipProfileCenter: {
      handler(ctx) {
        return getRoleForRelationshipProfileCenter({ ...ctx.params, ctx });
      },
    },
  },
};
