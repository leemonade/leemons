/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const { LeemonsError } = require('@leemons/error');
const fs = require('fs/promises');
const _ = require('lodash');

const { newMultipart } = require('../../core/files/newMultipart');
const { abortMultipart } = require('../../core/files/abortMultipart');
const { finishMultipart } = require('../../core/files/finishMultipart');
const { getByFile } = require('../../core/assets/files/getByFile');
const { dataForReturnFile } = require('../../core/files');

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
  // TODO: TOOOO DOOOOOOO!!!
  fileRest: {
    rest: {
      path: '/:id',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { id, download, onlyPublic } = ctx.params;
      const { headers } = ctx.meta;

      if (_.isEmpty(id)) {
        throw new LeemonsError(ctx, { message: 'Id is required', httpStatusCode: 400 });
      }

      const asset = await getByFile({ fileId: id, checkPermissions: !onlyPublic, onlyPublic, ctx });

      const canAccess = !_.isEmpty(asset);

      if (!canAccess) {
        throw new LeemonsError(ctx, {
          message: 'You do not have permissions to view this file',
          httpStatusCode: 403,
        });
      }

      let bytesStart = -1;
      let bytesEnd = -1;
      const { range } = headers;

      if (!download && range?.indexOf('bytes=') > -1) {
        const parts = range.replace(/bytes=/, '').split('-');
        bytesStart = parseInt(parts[0], 10);
        bytesEnd = parts[1] ? parseInt(parts[1], 10) : bytesStart + 10 * 1024 ** 2;
      }

      const { readStream, fileName, contentType, file } = await dataForReturnFile({
        id,
        path: ctx.params[0],
        start: bytesStart,
        end: bytesEnd,
        forceStream: !!ctx.params.forceStream,
        ctx,
      });

      if (_.isString(readStream) && readStream.indexOf('http') === 0) {
        // Redirect to external URL
        ctx.status = 307;
        ctx.set('Cache-Control', 'max-age=300');
        ctx.redirect(readStream);
        return;
      }

      const mediaType = contentType.split('/')[0];

      ctx.status = 200;
      ctx.body = readStream;
      ctx.set('Content-Type', contentType);

      if (download || (!['image', 'video', 'audio'].includes(mediaType) && !file.isFolder)) {
        // if (download || !['image', 'video', 'audio'].includes(mediaType)) {
        ctx.set('Content-disposition', `attachment; filename=${encodeURIComponent(fileName)}`);
      }

      if (!download && ['video', 'audio'].includes(mediaType)) {
        let fileSize = file.size;

        if (!fileSize && file.provider === 'sys') {
          const fileHandle = await fs.open(file.uri, 'r');
          const stats = await fileHandle.stat(file.uri);
          fileSize = stats.size;
        }

        if (fileSize > 0) {
          ctx.set('Content-Length', fileSize);
          // TODO Check if Accept-Ranges header is needed and streaming implications
          ctx.set('Accept-Ranges', 'bytes');
        }

        /*
        if (file.size > 0 && bytesStart > -1 && bytesEnd > -1) {
          ctx.status = 206;
          bytesEnd = Math.min(bytesEnd, file.size - 1);

          ctx.set('Accept-Ranges', 'bytes');
          ctx.set('Content-Length', bytesEnd - bytesStart);
          ctx.set('Content-Range', `bytes ${bytesStart}-${bytesEnd}/${file.size}`);
        }
        */
      }
    },
  },
};
