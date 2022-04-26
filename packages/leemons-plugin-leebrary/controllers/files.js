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
};
