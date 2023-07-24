/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const localization = require('../core/localization');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'multilanguage.contents',
  version: 1,
  mixins: [
    LeemonsMiddlewaresMixin(),
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],

  actions: {
    countKeyStartsWith: {
      handler(ctx) {
        return localization.countKeyStartsWith({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    countLocalesWithKey: {
      handler(ctx) {
        return localization.countLocalesWithKey({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    add: {
      handler(ctx) {
        return localization.add({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    addMany: {
      handler(ctx) {
        return localization.addMany({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    addManyByJSON: {
      handler(ctx) {
        return localization.addManyByJSON({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    addManyByKey: {
      handler(ctx) {
        return localization.addManyByKey({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    delete: {
      handler(ctx) {
        return localization.delete({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    deleteKeyStartsWith: {
      handler(ctx) {
        return localization.deleteKeyStartsWith({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    deleteMany: {
      handler(ctx) {
        return localization.deleteMany({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    deleteAll: {
      handler(ctx) {
        return localization.deleteAll({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    has: {
      handler(ctx) {
        return localization.has({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    hasMany: {
      handler(ctx) {
        return localization.hasMany({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    get: {
      handler(ctx) {
        return localization.get({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    getValue: {
      handler(ctx) {
        return localization.getValue({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    getManyWithKeys: {
      handler(ctx) {
        return localization.getManyWithKeys({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    getManyWithLocale: {
      handler(ctx) {
        return localization.getManyWithLocale({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    getWithKey: {
      handler(ctx) {
        return localization.getWithKey({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    getLocaleValueWithKey: {
      handler(ctx) {
        return localization.getLocaleValueWithKey({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    getWithLocale: {
      handler(ctx) {
        return localization.getWithLocale({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    getKeyValueWithLocale: {
      handler(ctx) {
        return localization.getKeyValueWithLocale({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    getKeyStartsWith: {
      handler(ctx) {
        return localization.getKeyStartsWith({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    getKeyValueStartsWith: {
      handler(ctx) {
        return localization.getKeyValueStartsWith({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    setValue: {
      handler(ctx) {
        return localization.setValue({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    setKey: {
      handler(ctx) {
        return localization.setKey({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    setMany: {
      handler(ctx) {
        return localization.setMany({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    setManyByKey: {
      handler(ctx) {
        return localization.setManyByKey({ ...ctx.params, isPrivate: true, ctx });
      },
    },
    setManyByJSON: {
      handler(ctx) {
        return localization.setManyByJSON({ ...ctx.params, isPrivate: true, ctx });
      },
    },
  },
  created() {
    mongoose.connect(process.env.MONGO_URI);
  },
});
