/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

/** @type {ServiceSchema} */
module.exports = {
  serveFileRest: {
    rest: {
      method: 'GET',
      path: '/:filePath(.*)',
    },
    async handler(ctx) {
      // TODO URGENTE MIRAR COMO MIGRAR ESTO
    },
  },
};
