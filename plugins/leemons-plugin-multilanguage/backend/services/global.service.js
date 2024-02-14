/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsCacheMixin } = require('@leemons/cache');
const { getServiceModels } = require('../models');
const { loadLocalizations } = require('../core/localization/global/loadLocalization');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: 'multilanguage.global',
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
    loadLocalizations: {
      handler: (ctx) => {
        const { localizations, plugin } = ctx.params;
        return loadLocalizations({ localizations, plugin, ctx });
      },
    },
  },
});
