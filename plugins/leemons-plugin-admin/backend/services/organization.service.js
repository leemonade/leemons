/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsError } = require('@leemons/error');
const { LeemonsCacheMixin } = require('@leemons/cache');
const { LeemonsMongoDBMixin } = require('@leemons/mongodb');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const { LeemonsMiddlewaresMixin } = require('@leemons/middlewares');
const { LeemonsMQTTMixin } = require('@leemons/mqtt');
const { colord } = require('colord');

const { getServiceModels } = require('../models');
const compileTokens = require('../core/organization/compileTokens');
const jsonRaw = require('../tokens/tokens.json');
const restActions = require('./rest/organization.rest');
const { PLUGIN_NAME } = require('../config/constants');
const organizationService = require('../core/organization');

/** @type {ServiceSchema} */
module.exports = {
  name: `${PLUGIN_NAME}.organization`,
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
    updatePrimaryColorAndCompileTokens: {
      async handler(ctx) {
        const { h, s, l } = colord(ctx.params.primaryColor).toHsl();
        const { customPrimary } = jsonRaw.core.core.color;
        customPrimary.hue.value = h.toString();
        customPrimary.saturation.value = s.toString();
        customPrimary.lightness.value = l.toString();
        await compileTokens({ jsonRaw, ctx });
      },
    },
    get: {
      async handler(ctx) {
        try {
          const organization = await organizationService.getOrganization({
            ctx: { ...ctx, meta: { ...ctx.meta, userSession: {} } },
          });
          return {
            status: 200,
            organization,
          };
        } catch (e) {
          throw new LeemonsError(ctx, { message: e.message, httpStatusCode: 400 });
        }
      },
    },
  },
};
