/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsMongoDBMixin, mongoose } = require('leemons-mongodb');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');
const { getServiceModels } = require('../models');
const { pluginName } = require('../config/constants');
const {
  uploadMultipartChunk,
  abortMultipart,
  finishMultipart,
  newMultipart,
  getReadStream,
  removeConfig,
  setConfig,
  upload,
  remove,
  clone,
} = require('../core/provider');

/** @type {ServiceSchema} */
module.exports = {
  name: `${pluginName}.provider`,
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
    abortMultipart: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        payload.file = payload.file ?? payload.dbfile;

        return abortMultipart(payload);
      },
    },
    uploadMultipartChunk: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        payload.file = payload.file ?? payload.dbfile;

        return uploadMultipartChunk(payload);
      },
    },
    finishMultipart: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        payload.file = payload.file ?? payload.dbfile;

        return finishMultipart(payload);
      },
    },
    newMultipart: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        payload.file = payload.file ?? payload.dbfile;

        return newMultipart(payload);
      },
    },
    getReadStream: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        payload.key = payload.key ?? payload.Key;

        return getReadStream(payload);
      },
    },
    removeConfig: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return removeConfig(payload);
      },
    },
    setConfig: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return setConfig(payload);
      },
    },
    upload: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return upload(payload);
      },
    },
    remove: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        payload.key = payload.key ?? payload.Key;

        return remove(payload);
      },
    },
    clone: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return clone(payload);
      },
    },
  },
  async created() {
    mongoose.connect(process.env.MONGO_URI);
  },
};
