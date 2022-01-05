const remove = require('../src/services/assets/remove');
const add = require('../src/services/assets/add');
const addFiles = require('../src/services/assets/files/addFiles');
const unlinkFiles = require('../src/services/assets/files/unlinkFiles');
const getFiles = require('../src/services/assets/files/getFiles');
const update = require('../src/services/assets/update');

module.exports = {
  add: async (ctx) => {
    const { name, description, cover } = ctx.request.body;
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
      cover,
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
    const { userSession } = ctx.state;

    try {
      const deleted = await remove(id, { userSession });

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
  update: async (ctx) => {
    const { id } = ctx.params;
    const { name, description, cover } = ctx.request.body;
    const { userSession } = ctx.state;

    try {
      const item = await update(id, { name, description, cover }, { userSession });
      ctx.status = 200;
      ctx.body = {
        status: 200,
        item,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  addFile: async (ctx) => {
    const { id, file } = ctx.params;
    const { userSession } = ctx.state;

    try {
      await addFiles(id, file, { userSession });
      ctx.status = 201;
      ctx.body = {
        status: 201,
        added: true,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
        added: false,
      };
    }
  },
  unlinkFile: async (ctx) => {
    const { id, file } = ctx.params;
    const { userSession } = ctx.state;

    try {
      const removed = await unlinkFiles(file, id, { userSession });
      ctx.status = 200;
      ctx.body = {
        status: 200,
        message: 'File removed',
        removed,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
        removed: false,
      };
    }
  },
  getFiles: async (ctx) => {
    const { id } = ctx.params;
    const { userSession } = ctx.state;

    try {
      const files = await getFiles(id, { userSession });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        files,
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
