/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { LeemonsMiddlewareAuthenticated } = require('leemons-middlewares');
const { newMultipart } = require('../../core/files/newMultipart');
const { abortMultipart } = require('../../core/files/abortMultipart');
const { finishMultipart } = require('../../core/files/finishMultipart');

module.exports = {
  newMultipartRest: {
    rest: {
      method: 'POST',
      path: '/multipart/new',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const payload = { ...ctx.params, ctx };
      const data = await newMultipart(payload);
      return { status: 200, ...data };
    },
  },
  abortMultipartRest: {
    rest: {
      method: 'POST',
      path: '/multipart/abort',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const payload = { ...ctx.params, ctx };
      const data = await abortMultipart(payload);
      return { status: 200, ...data };
    },
  },
  finishMultipartRest: {
    rest: {
      method: 'POST',
      path: '/multipart/finish',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const payload = { ...ctx.params, ctx };
      const data = await finishMultipart(payload);
      return { status: 200, ...data };
    },
  },
};
