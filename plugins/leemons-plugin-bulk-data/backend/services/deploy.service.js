/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMultiEventsMixin } = require('@leemons/multi-events');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { pluginName } = require('../config/constants');

/** @type {ServiceSchema} */
module.exports = () => ({
  name: `${pluginName}.deploy`,
  version: 1,
  mixins: [LeemonsMultiEventsMixin(), LeemonsMQTTMixin(), LeemonsDeploymentManagerMixin()],
  multiEvents: [],
});
