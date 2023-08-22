/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsCacheMixin } = require('leemons-cache');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');
const { LeemonsMiddlewaresMixin } = require('leemons-middlewares');

const restActions = require('./rest/init.rest');

/** @type {ServiceSchema} */
module.exports = {
  name: 'users.init',
  version: 1,
  mixins: [LeemonsMiddlewaresMixin(), LeemonsCacheMixin(), LeemonsDeploymentManagerMixin()],

  actions: {
    ...restActions,
  },

  created() {},
};
