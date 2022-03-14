const { add } = require('../src/services/assets/add');
const { update } = require('../src/services/assets/update');
const { remove } = require('../src/services/assets/remove');
const { getByUser } = require('../src/services/assets/getByUser');

async function addAsset(ctx) {
  const { ...assetData } = ctx.request.body;
  const filesData = ctx.request.files;
  const { userSession } = ctx.state;

  if (!filesData?.files) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: 'No file was uploaded',
    };
    return;
  }

  const files = filesData.files.length ? filesData.files : [filesData.files];

  if (files.length > 1) {
    ctx.status = 400;
    ctx.body = {
      status: 400,
      message: 'Multiple file uploading is not enabled yet',
    };
    return;
  }

  const asset = await add({ ...assetData, file: files[0] }, { userSession });

  ctx.status = 200;
  ctx.body = { status: 200, asset };
}

async function removeAsset(ctx) {
  const { id } = ctx.params;
  const { userSession } = ctx.state;

  const deleted = await remove(id, { userSession });
  ctx.status = 200;
  ctx.body = {
    status: 200,
    deleted,
  };
}

async function updateAsset(ctx) {
  const { id: assetId } = ctx.params;
  const { id, ...assetData } = ctx.request.body;
  const { userSession } = ctx.state;

  const asset = await update(assetId, { ...assetData }, { userSession });
  ctx.status = 200;
  ctx.body = {
    status: 200,
    asset,
  };
}

async function myAssets(ctx) {
  const { userSession } = ctx.state;
  const assets = await getByUser(userSession.id);
  ctx.status = 200;
  ctx.body = { status: 200, assets };
}

/*
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
*/
module.exports = {
  add: addAsset,
  remove: removeAsset,
  update: updateAsset,
  my: myAssets,
};
