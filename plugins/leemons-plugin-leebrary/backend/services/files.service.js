/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');

const { pluginName } = require('../config/constants');
const { abortMultipart } = require('../core/files/abortMultipart');
const { duplicate } = require('../core/files/duplicate');
const { finishMultipart } = require('../core/files/finishMultipart');
const { getByIds } = require('../core/files/getByIds');
const { getUploadChunkUrls } = require('../core/files/getUploadChunkUrls/getUploadChunkUrls');
const { uploadFromSource } = require('../core/files/helpers/uploadFromSource');
const { newMultipart } = require('../core/files/newMultipart');
const { getServiceModels } = require('../models');

const restActions = require('./rest/files.rest');

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
    duplicate: {
      params: {
        fileId: { type: 'string' },
        toFolder: { type: 'string', optional: true },
      },
      async handler(ctx) {
        const { fileId, toFolder } = ctx.params;
        const files = await getByIds({ fileIds: fileId, ctx });

        if (!files.length) {
          return null;
        }

        return duplicate({ file: files[0], toFolder, ctx });
      },
    },
    // Multipart actions
    newMultipart: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return newMultipart(payload);
      },
    },
    getUploadChunkUrls: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return getUploadChunkUrls(payload);
      },
    },
    abortMultipart: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return abortMultipart(payload);
      },
    },
    finishMultipart: {
      handler(ctx) {
        const payload = { ...ctx.params, ctx };
        return finishMultipart(payload);
      },
    },
  },
};
