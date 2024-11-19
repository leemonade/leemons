/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const path = require('path');

const { pluginName } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: `${pluginName}.deploy`,
  version: 1,
  mixins: [
    LeemonsMultilanguageMixin({
      locales: ['es', 'en'],
      i18nPath: path.resolve(__dirname, `../i18n/`),
    }),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
    }),
    LeemonsDeploymentManagerMixin(),
  ],
  events: {
    'deployment-manager.install': async (ctx) => {
      // Register as a library provider
      await ctx.tx.call('leebrary.providers.register', {
        name: 'Amazon S3',
        image: 'https://cdn.worldvectorlogo.com/logos/aws-glacier.svg',
        type: 'storage',
        supportedMethods: {
          uploadMultipartChunk: true,
          getUploadChunkUrls: true,
          finishMultipart: true,
          abortMultipart: true,
          getS3AndConfig: true,
          getReadStream: true,
          removeConfig: true,
          newMultipart: true,
          getConfig: true,
          setConfig: true,
          upload: true,
          remove: true,
          clone: true,
        },
      });
    },
  },
});
