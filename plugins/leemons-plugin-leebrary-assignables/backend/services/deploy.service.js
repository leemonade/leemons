/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { pluginName } = require('../config/constants');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: `${pluginName}.deploy`,
  version: 1,
  mixins: [LeemonsDeploymentManagerMixin()],
  events: {
    'deployment-manager.install': async (ctx) => {
      // Register as a library provider
      await ctx.tx.call('leebrary.provider.register', {
        name: 'Library Assignables',
        supportedMethods: {
          getByIds: true,
          search: true,
        },
      });
    },
  },
});
