const path = require('path');
const { LeemonsError } = require('@leemons/error');
const { createReadStream } = require('fs');
const mime = require('mime-types');

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
      const { filePath } = ctx.params;

      const publicPath = path.resolve(__dirname, '../../public');
      const absolutePath = path.resolve(publicPath, filePath);
      const relative = path.relative(publicPath, absolutePath);
      const isInside = relative && !relative.startsWith('..') && !path.isAbsolute(relative);

      if (!isInside) {
        throw new LeemonsError(ctx, { message: 'File not found', httpStatusCode: 404 });
      } else {
        const readStream = createReadStream(absolutePath);
        const contentType = mime.lookup(absolutePath);

        console.log('absolutePath', absolutePath, 'content-Type', contentType);

        ctx.meta.$responseType = contentType;
        ctx.meta.$responseHeaders = {
          'Content-Type': contentType,
        };
        return readStream;
      }
    },
  },
};
