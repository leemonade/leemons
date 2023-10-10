/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { getServiceModels } = require('../models');
const localization = require('../core/localization');
const restActions = require('./rest/common.rest');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'multilanguage.common',
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
    countKeyStartsWith: {
      handler(ctx) {
        return localization.countKeyStartsWith({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    countLocalesWithKey: {
      handler(ctx) {
        return localization.countLocalesWithKey({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    add: {
      handler(ctx) {
        return localization.add({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    addMany: {
      handler(ctx) {
        return localization.addMany({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    addManyByJSON: {
      handler(ctx) {
        return localization.addManyByJSON({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    addManyByKey: {
      handler(ctx) {
        return localization.addManyByKey({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    delete: {
      handler(ctx) {
        return localization.delete({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    deleteKeyStartsWith: {
      handler(ctx) {
        return localization.deleteKeyStartsWith({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    deleteMany: {
      handler(ctx) {
        return localization.deleteMany({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    deleteAll: {
      handler(ctx) {
        return localization.deleteAll({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    has: {
      handler(ctx) {
        return localization.has({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    hasMany: {
      handler(ctx) {
        return localization.hasMany({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    get: {
      handler(ctx) {
        return localization.get({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    getValue: {
      handler(ctx) {
        return localization.getValue({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    getManyWithKeys: {
      handler(ctx) {
        return localization.getManyWithKeys({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    getManyWithLocale: {
      handler(ctx) {
        return localization.getManyWithLocale({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    getWithKey: {
      handler(ctx) {
        return localization.getWithKey({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    getLocaleValueWithKey: {
      handler(ctx) {
        return localization.getLocaleValueWithKey({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    getWithLocale: {
      handler(ctx) {
        return localization.getWithLocale({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    getKeyValueWithLocale: {
      handler(ctx) {
        return localization.getKeyValueWithLocale({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    getKeyStartsWith: {
      handler(ctx) {
        return localization.getKeyStartsWith({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    getKeyValueStartsWith: {
      handler(ctx) {
        return localization.getKeyValueStartsWith({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    setValue: {
      handler(ctx) {
        return localization.setValue({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    setKey: {
      handler(ctx) {
        return localization.setKey({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    setMany: {
      handler(ctx) {
        return localization.setMany({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    setManyByKey: {
      handler(ctx) {
        return localization.setManyByKey({ ...ctx.params, isPrivate: false, ctx });
      },
    },
    setManyByJSON: {
      handler(ctx) {
        return localization.setManyByJSON({ ...ctx.params, isPrivate: false, ctx });
      },
    },
  },
  created() {
    // mongoose.connect(process.env.MONGO_URI);
  },
});
