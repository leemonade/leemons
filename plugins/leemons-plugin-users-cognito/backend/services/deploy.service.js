const path = require('path');

const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsMultilanguageMixin } = require('@leemons/multilanguage');
const { PLUGIN_NAME, PLUGIN_VERSION } = require('../config/constants');
const { getServiceModels } = require('../models');

/** @type {import('moleculer').ServiceSchema} */
module.exports = {
  name: `${PLUGIN_NAME}.deploy`,
  version: PLUGIN_VERSION,
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
      await ctx.tx.call('users.providers.register', {
        name: 'Cognito',
        image: 'https://cdn.worldvectorlogo.com/logos/cognito.svg',
        supportedMethods: {},
      });
    },
  },
};
