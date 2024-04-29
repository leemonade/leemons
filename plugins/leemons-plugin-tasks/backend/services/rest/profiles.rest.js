/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');

const get = require('../../core/profiles/get');
const set = require('../../core/profiles/set');

const getRest = require('./openapi/profiles/getRest');
const setRest = require('./openapi/profiles/setRest');
const setManyRest = require('./openapi/profiles/setManyRest');
/** @type {ServiceSchema} */
module.exports = {
  getRest: {
    openapi: getRest.openapi,
    rest: {
      method: 'GET',
      path: '/:key',
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
    openapi: setRest.openapi,
    rest: {
      method: 'POST',
      path: '/:key',
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
    openapi: setManyRest.openapi,
    rest: {
      method: 'POST',
      path: '/',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { profiles } = ctx.params;

      await Promise.all(
        profiles.map(({ profile, key }) => set({ key, profile, ctx }))
      );

      return {
        status: 200,
        profiles,
      };
    },
  },
};
