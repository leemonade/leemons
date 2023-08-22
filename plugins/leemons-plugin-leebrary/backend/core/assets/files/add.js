const { LeemonsError } = require('leemons-error');
const { exists: fileExists } = require('../../files/exists');
const { exists: assetExists } = require('../exists');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');

async function add({ fileId, assetId, skipPermissions, ctx }) {
  try {
    // EN: Get the user permissions
    // ES: Obtener los permisos del usuario
    const { permissions } = await getPermissions({ assetId, ctx });

    // EN: Check if the user has permissions to update the asset
    // ES: Comprobar si el usuario tiene permisos para actualizar el activo
    if (!permissions.edit && !skipPermissions) {
      throw new global.utils.HttpError(401, "You don't have permissions to update this asset");
    }

    if (!(await fileExists({ fileId, ctx }))) {
      // eslint-disable-next-line no-console
      console.log('ERROR fileId:', fileId);
      throw new LeemonsError(ctx, {
        message: 'File not found',
        httpStatusCode: 422,
      });
    }

    if (!(await assetExists({ assetId, ctx }))) {
      throw new LeemonsError(ctx, {
        message: 'Asset not found',
        httpStatusCode: 422,
      });
    }

    return ctx.tx.db.AssetsFiles.findOneAndUpdate(
      { asset: assetId, file: fileId },
      { asset: assetId, file: fileId },
      { upsert: true, lean: true, new: true }
    );
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to add file: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { add };
