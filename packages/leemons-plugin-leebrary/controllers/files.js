const { isEmpty } = require('lodash');
const fileService = require('../src/services/files');
const { getByFile } = require('../src/services/assets/files/getByFile');

/**
 * Get file content from ID
 * @param {*} ctx
 */
async function getFileContent(ctx) {
  const { id, download } = ctx.params;
  const { userSession } = ctx.state;

  if (isEmpty(id)) {
    throw new global.utils.HttpError(400, 'id is required');
  }

  const asset = await getByFile(id, { checkPermissions: true, userSession });

  const canAccess = !isEmpty(asset);

  if (!canAccess) {
    throw new global.utils.HttpError(403, 'You do not have permissions to view this file');
  }

  const { readStream, fileName, contentType, file } = await fileService.dataForReturnFile(id);

  const mediaType = contentType.split('/')[0];

  ctx.status = 200;
  ctx.body = readStream;
  ctx.set('Content-Type', contentType);

  if (['image', 'video', 'audio'].includes(mediaType)) {
    // TODO: handle content disposition for images, video and audio. Taking care of download param
  } else {
    ctx.set('Content-disposition', `attachment; filename=${fileName}`);
  }
}

module.exports = {
  file: getFileContent,
  /*
  uploadFile: async (ctx) => {
    const { name, description } = ctx.request.body;
    const _files = ctx.request.files;

    if (!_files?.files) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: 'No file was uploaded',
      };
      return;
    }
    const files = _files.files.length ? _files.files : [_files.files];

    if (files.length > 1) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: 'Multiple file uploading is not enabled yet',
      };
      return;
    }

    const asset = {
      name,
      description,
    };

    const file = await fileService.uploadFile(files[0], asset, {
      userSession: ctx.state.userSession,
    });

    ctx.status = 200;
    ctx.body = JSON.stringify({ status: 200, file }, null, 2);
  },

  myFiles: async (ctx) => {
    const files = await fileService.filesByUser(ctx.state.userSession);
    ctx.status = 200;
    ctx.body = { status: 200, files };
  },
  removeFile: async (ctx) => {
    const deleted = await fileService.removeFiles(ctx.params.id);
    ctx.status = 200;
    ctx.body = { status: 200, deleted };
  },
  */
};
