/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
/** @type {ServiceSchema} */

const { LeemonsError } = require('@leemons/error');
const { LeemonsMiddlewareAuthenticated } = require('@leemons/middlewares');
const fs = require('fs/promises');
const _ = require('lodash');

const { getByFile } = require('../../core/assets/files/getByFile');
const { getByIds } = require('../../core/assets/getByIds');
const { dataForReturnFile } = require('../../core/files');
const { abortMultipart } = require('../../core/files/abortMultipart');
const { finishMultipart } = require('../../core/files/finishMultipart');
const { getUploadChunkUrls } = require('../../core/files/getUploadChunkUrls/getUploadChunkUrls');
const { newMultipart } = require('../../core/files/newMultipart');
const { createTemp } = require('../../core/files/upload/createTemp');
const { uploadMultipartChunk } = require('../../core/files/uploadMultipartChunk');

const getFileRest = async ({ ctx, payload }) => {
  const { id, download, onlyPublic } = payload;

  if (_.isEmpty(id)) {
    throw new LeemonsError(ctx, { message: 'Id is required', httpStatusCode: 400 });
  }

  let checkPermissions = !onlyPublic;
  if (checkPermissions) {
    const isSuperAdmin = await ctx.tx.call('users.users.isSuperAdmin', {
      userId: ctx.meta.userSession.id,
    });

    checkPermissions = !isSuperAdmin;
  }

  const asset = await getByFile({
    fileId: id,
    checkPermissions,
    onlyPublic,
    ctx,
  });
  const canAccess = !_.isEmpty(asset);

  if (!canAccess) {
    throw new LeemonsError(ctx, {
      message: 'You do not have permissions to view this file',
      httpStatusCode: 403,
    });
  }

  let bytesStart = -1;
  let bytesEnd = -1;
  const range = ctx.meta.headers?.range || undefined;

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

  // Redirect to external URL
  if (_.isString(readStream) && readStream.indexOf('http') === 0) {
    ctx.meta.$statusCode = 307;
    ctx.meta.$responseHeaders = {
      'Cache-Control': 'max-age=300',
    };
    ctx.meta.$location = readStream;
    return;
  }

  const mediaType = contentType.split('/')[0];

  ctx.meta.$responseType = contentType;
  ctx.meta.$responseHeaders = {
    'Content-Type': contentType,
  };
  if (download || (!['image', 'video', 'audio'].includes(mediaType) && !file.isFolder)) {
    ctx.meta.$responseHeaders = {
      'Content-Disposition': `attachment; filename=${encodeURIComponent(fileName)}`,
    };
  }

  if (!download && ['video', 'audio'].includes(mediaType)) {
    let fileSize = file.size;

    if (!fileSize && file.provider === 'sys') {
      const fileHandle = await fs.open(file.uri, 'r');
      const stats = await fileHandle.stat(file.uri);
      fileSize = stats.size;
    }

    if (fileSize > 0) {
      ctx.meta.$responseHeaders = { 'Content-Length': fileSize };
      // TO solve: Check if Accept-Ranges header is needed and streaming implications
      ctx.meta.$responseHeaders = { 'Accept-Ranges': 'bytes' };
    }
  }
  // eslint-disable-next-line consistent-return
  return readStream;
};

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
  getUploadChunkUrlsRest: {
    rest: {
      method: 'POST',
      path: '/multipart/chunk/urls',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const payload = { ...ctx.params, ctx };
      const urls = await getUploadChunkUrls(payload);
      return { status: 200, urls };
    },
  },
  uploadMultipartChunkRest: {
    rest: {
      method: 'POST',
      path: '/multipart/chunk',
      type: 'multipart',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const temp = await createTemp({ readStream: ctx.params });
      return {
        status: 200,
        body: await uploadMultipartChunk({
          ...JSON.parse(ctx.meta.$multipart.body),
          chunk: temp,
          ctx,
        }),
      };
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
  fileRest: {
    rest: {
      path: '/:id',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated({ continueEvenThoughYouAreNotLoggedIn: true })],
    // eslint-disable-next-line sonarjs/cognitive-complexity
    async handler(ctx) {
      return getFileRest({ ctx, payload: ctx.params });
    },
  },
  publicFileRest: {
    rest: {
      path: '/public/:id',
      method: 'GET',
    },
    async handler(ctx) {
      const payload = { ...ctx.params };
      payload.onlyPublic = true;
      return getFileRest({ ctx, payload });
    },
  },
  publicFolderRest: {
    rest: {
      path: '/public/:id/(.*)',
      method: 'GET',
    },
    async handler(ctx) {
      const payload = { ...ctx.params };
      payload.onlyPublic = true;
      payload.forceStream = true;
      return getFileRest({ ctx, payload });
    },
  },
  coverRest: {
    rest: {
      path: '/img/:assetId',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated({ continueEvenThoughYouAreNotLoggedIn: true })],
    async handler(ctx) {
      const { assetId } = ctx.params;

      if (_.isEmpty(assetId)) {
        throw new LeemonsError(ctx, { message: 'Asset ID is required', httpStatusCode: 400 });
      }

      const assets = await getByIds({
        ids: [assetId],
        checkPermissions: true,
        showPublic: true,
        ctx,
      });

      const [asset] = assets;

      if (!asset) {
        throw new LeemonsError(ctx, {
          message: "You don't have permissions to view this Asset or the asset doens't exists",
          httpStatusCode: 403,
        });
      }

      if (asset.cover) {
        const { readStream, fileName, contentType } = await dataForReturnFile({
          id: asset.cover,
          forceStream: false,
          ctx,
        });

        if (_.isString(readStream) && readStream.indexOf('http') === 0) {
          // Redirect to external URL
          ctx.meta.$statusCode = 307;
          ctx.meta.$responseHeaders = {
            'Cache-Control': 'max-age=86400',
          };
          ctx.meta.$location = readStream;
          return;
        }

        const mediaType = contentType.split('/')[0];

        ctx.meta.$responseHeaders = {
          'Contet-Type': contentType,
        };

        if (['image', 'video', 'audio'].includes(mediaType)) {
          // To implement: handle content disposition for images, video and audio. Taking care of download param
        } else {
          ctx.meta.$responseHeaders = {
            'Content-disposition': `attachment; filename=${encodeURIComponent(fileName)}`,
          };
        }
        // eslint-disable-next-line consistent-return
        return { status: 200, readStream };
      }

      // eslint-disable-next-line consistent-return
      throw new LeemonsError(ctx, {
        message: 'This asset does not have a cover',
        httpStatusCode: 400,
      });
      // The following two lines were commented in leemons legacy
      // ctx.body = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>';
      // ctx.set('Content-Type', 'image/svg+xml');
    },
  },
  getFileCopyright: {
    rest: {
      path: '/copyright/:id',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const data = await ctx.tx.db.Files.findOne({
        id: ctx.params.id,
      })
        .select(['copyright', 'externalUrl'])
        .lean();

      if (!data) {
        throw new LeemonsError(ctx, {
          message: 'File not found',
          httpStatusCode: 404,
        });
      }

      return {
        status: 200,
        data: { copyright: data.copyright, externalUrl: data.externalUrl },
      };
    },
  },
  /*
      folderRest: {
        rest: {
          path: 'private/:id/(.*)',
          method: 'GET',
        },
        middlewares: [LeemonsMiddlewareAuthenticated()],
        async handler(ctx) {
          const payload = { ...ctx.params };
          payload.forceStream = true;
          return ctx.tx.call(fileRestService, payload);
        },
      },

       */
};
