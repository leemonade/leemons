const { isEmpty } = require('lodash');
const { LeemonsError } = require('leemons-error');

const { remove: removeFiles } = require('../files/remove');
const { getByAsset: getFilesByAsset } = require('../files/getByAsset');
const { getById: getCategoryById } = require('../../categories/getById');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const getAssetPermissionName = require('../../permissions/helpers/getAssetPermissionName');
const { getByIds } = require('../getByIds');
const { remove: removeBookmark } = require('../../bookmarks/remove');
const { CATEGORIES } = require('../../../config/constants');

/**
 * Removes an asset from the database.
 *
 * @async
 * @function remove
 * @param {string} id - The id of the asset to be removed.
 * @param {boolean} soft - A flag indicating whether to perform a soft delete.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<boolean>} - Returns a promise that resolves to true if the asset was successfully removed.
 * @throws {HttpError} - Throws an HttpError if the asset does not exist or the user does not have permission to remove the asset.
 */
async function remove({ id, soft, ctx }) {
  // ··········································································
  // CHECKING

  // EN: Check if the asset exists (if not it will throw an error)
  // ES: Comprobar si el activo existe (si no, lanzará un error)
  const asset = (await getByIds({ ids: id, ctx }))[0];
  if (!asset) {
    throw new LeemonsError(ctx, {
      message: `Asset with ${id} does not exists`,
      httpStatusCode: 500,
    });
  }

  // EN: Get user role
  // ES: Obtener rol del usuario
  const { permissions } = await getPermissions({ assetId: id, ctx });

  if (!permissions.delete) {
    throw new LeemonsError(ctx, {
      message: "You don't have permission to remove this asset",
      httpStatusCode: 401,
    });
  }

  await ctx.tx.emit('before-remove-asset', { assetId: id, soft });

  try {
    // ··········································································
    // REMOVE TAGS

    // EN: Delete the asset tags to clean the database
    // ES: Eliminar las etiquetas del asset para limpiar la base de datos

    await ctx.tx.call('common.tags.removeAllTagsForValues', {
      type: ctx.prefixPN(''),
      values: id,
    });

    // ··········································································
    // REMOVE FILES

    // EN: Get the files associated with the asset
    // ES: Obtener los archivos asociados al asset
    const files = await getFilesByAsset({ assetId: id, ctx });

    // EN: Unlink the files from the asset
    // ES: Desvincular los archivos del asset
    if (files.length) {
      // EN: Finally, delete the files from the provider
      // ES: Finalmente, eliminamos los archivos del proveedor
      await removeFiles({ fileIds: files, assetId: id, ctx });
    }

    // ··········································································
    // REMOVE BOOKMARK

    const category = await getCategoryById({ id: asset.category, ctx });
    if (category.key === CATEGORIES.BOOKMARKS) {
      await removeBookmark({ assetId: id, ctx });
    }

    // ··········································································
    // REMOVE COVER

    if (!isEmpty(asset.cover)) {
      await removeFiles({ fileIds: asset.cover, assetId: id, ctx });
    }

    // ··········································································
    // REMOVE ASSET

    // EN: First delete the file from the database so if it fails we don't have an entry without a file
    // ES: Primero eliminamos el archivo de la base de datos para que si falla no tengamos una entrada sin archivo
    await ctx.tx.db.Assets.deleteOne({ id }, { soft });

    // ··········································································
    // REMOVE PERMISSIONS

    // EN: Remove all the permissions associated with the asset
    // ES: Eliminar todos los permisos asociados al asset

    const permissionQuery = {
      permissionName: getAssetPermissionName({ assetId: id, ctx }),
    };

    await Promise.all([
      // ES: Borramos a todos los agentes el permiso del evento ya que este dejara de existir
      await ctx.tx.call('users.permissions.removeCustomPermissionForAllUserAgents', {
        data: permissionQuery,
      }),
      // ES: Borramos el elemento de la tabla items de permisos ya que dejara de existir
      await ctx.tx.call('users.permissions.removeItems', {
        query: {
          type: ctx.prefixPN(asset.category),
          item: id,
        },
        soft,
      }),
    ]);

    await ctx.tx.emit('after-remove-asset', { assetId: id, soft });
    return true;
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to remove asset: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { remove };
