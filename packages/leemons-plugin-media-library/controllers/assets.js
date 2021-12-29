const remove = require('../src/services/assets/remove');
const add = require('../src/services/assets/add');

module.exports = {
  add: async (ctx) => {
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

    const file = await add(asset, {
      userSession: ctx.state.userSession,
    });

    ctx.status = 200;
    ctx.body = { status: 200, file };
  },
  remove: async (ctx) => {
    const { id } = ctx.params;

    try {
      const deleted = await remove(id);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        deleted,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
};
