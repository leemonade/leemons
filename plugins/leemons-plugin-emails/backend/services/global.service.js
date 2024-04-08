/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsCacheMixin } = require('@leemons/cache');
const { getServiceModels } = require('../models');
const { addEmailTemplates } = require('../core/global/addEmailTemplates');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'emails.global',
  version: 1,
  mixins: [
    LeemonsCacheMixin(),
    LeemonsMongoDBMixin({
      models: getServiceModels(),
      forceLeemonsDeploymentManagerMixinNeedToBeImported: false,
      autoDeploymentID: true,
    }),
  ],

  actions: {
    addEmailTemplates: {
      handler: async (ctx) => {
        ctx.logger = ctx.logger ?? ctx.broker?.logger;

        const { templates } = ctx.params;

        return addEmailTemplates({ templates, ctx });
      },
    },
  },
});
