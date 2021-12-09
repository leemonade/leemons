const _ = require('lodash');
const fileService = require('../src/services/files');

async function uploadFile(ctx) {
  const file = await fileService.uploadFiles(ctx.request.files.files, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = JSON.stringify({ status: 200, file }, null, 2);
}

async function myFiles(ctx) {
  const files = await fileService.filesByUser(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, files };
}

async function file(ctx) {
  const data = await fileService.dataForReturnFile(ctx.params.id);
  ctx.status = 200;
  ctx.body = data.readStream;
  ctx.set('Content-Type', data.contentType);
  ctx.set('Content-disposition', `attachment; filename=${data.fileName}`);
}

async function removeFile(ctx) {
  await fileService.removeFiles(ctx.params.id);
  ctx.status = 200;
  ctx.body = { status: 200 };
}

module.exports = {
  removeFile,
  uploadFile,
  myFiles,
  file,
};
