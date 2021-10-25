const _ = require('lodash');
const fileService = require('../src/services/files');

async function uploadFile(ctx) {
  const response = await fileService.uploadFiles(ctx.request.files.files);
  ctx.status = 200;
  ctx.body = JSON.stringify({ status: 200, miau: 'Miau' }, null, 2);
}

module.exports = {
  uploadFile,
};
