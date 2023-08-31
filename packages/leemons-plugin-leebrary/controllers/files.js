const { isEmpty, isString } = require('lodash');
const fs = require('fs/promises');
const fileService = require('../src/services/files');
const { getByFile } = require('../src/services/assets/files/getByFile');
const { getByIds } = require('../src/services/assets/getByIds');
const { newMultipart } = require('../src/services/files/newMultipart');
const { abortMultipart } = require('../src/services/files/abortMultipart');
const { finishMultipart } = require('../src/services/files/finishMultipart');
const { uploadMultipartChunk } = require('../src/services/files/uploadMultipartChunk');

/**
 * Get file content from ID
 * @param {*} ctx
 */
async function getFileContent(ctx) {
  const { id, download } = ctx.params;
  const { onlyPublic } = ctx.query;
  const { userSession } = ctx.state;
  const { headers } = ctx.request;

  if (isEmpty(id)) {
    throw new global.utils.HttpError(400, 'id is required');
  }

  const asset = await getByFile(id, {
    checkPermissions: !onlyPublic,
    onlyPublic,
    userSession,
  });

  const canAccess = !isEmpty(asset);

  if (!canAccess) {
    throw new global.utils.HttpError(403, 'You do not have permissions to view this file');
  }

  let bytesStart = -1;
  let bytesEnd = -1;
  const { range } = headers;

  if (!download && range?.indexOf('bytes=') > -1) {
    const parts = range.replace(/bytes=/, '').split('-');
    bytesStart = parseInt(parts[0], 10);
    bytesEnd = parts[1] ? parseInt(parts[1], 10) : bytesStart + 10 * 1024 ** 2;
  }

  const { readStream, fileName, contentType, file } = await fileService.dataForReturnFile(id, {
    path: ctx.params[0],
    start: bytesStart,
    end: bytesEnd,
    forceStream: !!ctx.query.forceStream,
  });

  if (isString(readStream) && readStream.indexOf('http') === 0) {
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
}

async function getFolderContent(ctx) {
  ctx.query.forceStream = true;
  return getFileContent(ctx);
}

/**
 *
 */
async function getPublicFileContent(ctx) {
  ctx.query.onlyPublic = true;
  return getFileContent(ctx);
}

async function getPublicFolderContent(ctx) {
  ctx.query.onlyPublic = true;
  ctx.query.forceStream = true;
  return getFileContent(ctx);
}

/**
 * Get cover file content from Asset ID
 * @param {*} ctx
 */
async function getCoverFileContent(ctx) {
  const { assetId } = ctx.params;
  const { userSession } = ctx.state;

  if (isEmpty(assetId)) {
    throw new global.utils.HttpError(400, 'Asset ID is required');
  }

  const assets = await getByIds([assetId], {
    checkPermissions: true,
    showPublic: true,
    userSession,
  });

  const [asset] = assets;

  if (!asset) {
    throw new global.utils.HttpError(
      403,
      "You don't have permissions to view this Asset or doens't exists"
    );
  }
  if (asset.cover) {
    const { readStream, fileName, contentType } = await fileService.dataForReturnFile(asset.cover, {
      forceStream: false,
    });

    if (isString(readStream) && readStream.indexOf('http') === 0) {
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

    if (['image', 'video', 'audio'].includes(mediaType)) {
      // TODO: handle content disposition for images, video and audio. Taking care of download param
    } else {
      ctx.set('Content-disposition', `attachment; filename=${encodeURIComponent(fileName)}`);
    }
  } else {
    ctx.status = 400;
    // ctx.body = '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>';
    // ctx.set('Content-Type', 'image/svg+xml');
  }
}

async function newMultipartFunc(ctx) {
  ctx.status = 200;
  ctx.body = await newMultipart(ctx.request.body);
}

async function uploadMultipartChunkFunc(ctx) {
  ctx.status = 200;
  ctx.body = await uploadMultipartChunk({
    ...JSON.parse(ctx.request.body.body),
    chunk: ctx.request.files.chunk,
  });
}

async function abortMultipartFunc(ctx) {
  ctx.status = 200;
  ctx.body = await abortMultipart(ctx.request.body);
}

async function finishMultipartFunc(ctx) {
  ctx.status = 200;
  ctx.body = await finishMultipart(ctx.request.body);
}

module.exports = {
  file: getFileContent,
  folder: getFolderContent,
  publicFile: getPublicFileContent,
  publicFolder: getPublicFolderContent,
  cover: getCoverFileContent,
  newMultipart: newMultipartFunc,
  abortMultipart: abortMultipartFunc,
  finishMultipart: finishMultipartFunc,
  uploadMultipartChunk: uploadMultipartChunkFunc,
};
