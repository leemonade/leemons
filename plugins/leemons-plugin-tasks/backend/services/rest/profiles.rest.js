/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const get = require('../../core/profiles/get');
const set = require('../../core/profiles/set');

/** @type {ServiceSchema} */
module.exports = {
  getRest: {
    rest: {
      method: 'GET',
      path: '/profiles/:key',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { key } = ctx.params;
      const profile = await get({ key, ctx });
      return {
        status: 200,
        profile,
      };
    },
  },

  setRest: {
    rest: {
      method: 'POST',
      path: '/profiles/:key',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { key, profile } = ctx.params;
      await set({ key, profile, ctx });

      return {
        status: 200,
        key,
        profile,
      };
    },
  },

  setManyRest: {
    rest: {
      method: 'POST',
      path: '/profiles',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { profiles } = ctx.params;

      await Promise.all(profiles.map(({ profile, key }) => set({ key, profile, ctx })));

      return {
        status: 200,
        profiles,
      };
    },
  },
};
