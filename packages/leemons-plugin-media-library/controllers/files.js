const fileService = require('../src/services/files');

module.exports = {
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
      file: files[0],
    };

    const file = await fileService.saveAsset(asset, {
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

  file: async (ctx) => {
    const data = await fileService.dataForReturnFile(ctx.params.id);
    ctx.status = 200;
    ctx.body = data.readStream;
    ctx.set('Content-Type', data.contentType);
    ctx.set('Content-disposition', `attachment; filename=${data.fileName}`);
  },

  removeFile: async (ctx) => {
    await fileService.removeFiles(ctx.params.id);
    ctx.status = 200;
    ctx.body = { status: 200 };
  },
};
