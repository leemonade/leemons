const { isEmpty } = require('lodash');
const { remove: removeFiles } = require('../files/remove');
const { getByAsset: getFilesByAsset } = require('./files/getByAsset');
const { tables } = require('../tables');
const { getById: getCategoryById } = require('../categories/getById');
const { getByAsset: getPermissions } = require('../permissions/getByAsset');
const getAssetPermissionName = require('../permissions/helpers/getAssetPermissionName');
const { getByIds } = require('./getByIds');
const { remove: removeBookmark } = require('../bookmarks/remove');
const { CATEGORIES } = require('../../../config/constants');

async function remove(id, { soft, userSession, transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      // ··········································································
      // CHECKING

      // EN: Check if the asset exists (if not it will throw an error)
      // ES: Comprobar si el activo existe (si no, lanzará un error)
      const asset = (await getByIds(id, { transacting }))[0];
      if (!asset) {
        throw new global.utils.HttpError(500, `Asset with ${id} does not exists`);
      }

      // EN: Get user role
      // ES: Obtener rol del usuario
      const { permissions } = await getPermissions(id, { userSession, transacting });

      if (!permissions.delete) {
        throw new global.utils.HttpError(401, "You don't have permission to remove this asset");
      }

      await leemons.events.emit('before-remove-asset', { id, soft, transacting });

      try {
        // ··········································································
        // REMOVE TAGS

        // EN: Delete the asset tags to clean the database
        // ES: Eliminar las etiquetas del asset para limpiar la base de datos
        const tagsService = leemons.getPlugin('common').services.tags;
        await tagsService.removeAllTagsForValues(leemons.plugin.prefixPN(''), id, {
          transacting,
        });

        // ··········································································
        // REMOVE FILES

        // EN: Get the files associated with the asset
        // ES: Obtener los archivos asociados al asset
        const files = await getFilesByAsset(id, { userSession, transacting });

        // EN: Unlink the files from the asset
        // ES: Desvincular los archivos del asset
        if (files.length) {
          // EN: Finally, delete the files from the provider
          // ES: Finalmente, eliminamos los archivos del proveedor
          await removeFiles(files, id, { userSession, soft, transacting });
        }

        // ··········································································
        // REMOVE BOOKMARK

        const category = await getCategoryById(asset.category, { transacting });
        if (category.key === CATEGORIES.BOOKMARKS) {
          await removeBookmark(id, { userSession, transacting });
        }

        // ··········································································
        // REMOVE COVER

        if (!isEmpty(asset.cover)) {
          await removeFiles(asset.cover, id, { userSession, soft, transacting });
        }

        // ··········································································
        // REMOVE ASSET

        // EN: First delete the file from the database so if it fails we don't have an entry without a file
        // ES: Primero eliminamos el archivo de la base de datos para que si falla no tengamos una entrada sin archivo
        await tables.assets.delete({ id }, { soft, transacting });

        // ··········································································
        // REMOVE PERMISSIONS

        // EN: Remove all the permissions associated with the asset
        // ES: Eliminar todos los permisos asociados al asset
        const { services: userService } = leemons.getPlugin('users');
        const permissionQuery = {
          permissionName: getAssetPermissionName(id),
        };

        await Promise.all([
          // ES: Borramos a todos los agentes el permiso del evento ya que este dejara de existir
          await userService.permissions.removeCustomPermissionForAllUserAgents(permissionQuery, {
            soft,
            transacting,
          }),
          // ES: Borramos el elemento de la tabla items de permisos ya que dejara de existir
          await userService.permissions.removeItems(
            {
              type: leemons.plugin.prefixPN(asset.category),
              item: id,
            },
            {
              soft,
              transacting,
            }
          ),
        ]);

        await leemons.events.emit('after-remove-asset', { id, soft, transacting });
        return true;
      } catch (e) {
        throw new global.utils.HttpError(500, `Failed to remove asset: ${e.message}`);
      }
    },
    tables.assets,
    t
  );
}

module.exports = { remove };
