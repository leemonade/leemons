const removeFiles = require('../files/removeFiles');
const removeAllUsers = require('../permissions/removeAllUsers');
// const removeCategories = require('../files/categories/remove');
const { assets: table } = require('../tables');
const getFiles = require('./files/getFiles');

module.exports = async function removeAsset(id, { userSession, transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      try {
        // EN: Check if the asset exists (if not it will throw an error)
        // ES: Comprobar si el activo existe (si no, lanzará un error)
        await table.findOne({ id }, { transacting });

        // EN: Get the files associated with the asset
        // ES: Obtener los archivos asociados al asset
        const files = await getFiles(id, { userSession, transacting });

        // EN: First delete the file from the database so if it fails we don't have an entry without a file
        // ES: Primero eliminamos el archivo de la base de datos para que si falla no tengamos una entrada sin archivo
        await table.delete({ id }, { transacting });

        // EN: Unlink the files from the asset
        // ES: Desvincular los archivos del asset
        if (files.length) {
          // EN: Delete the asset categories to clean the database
          // ES: Eliminar las categorias del asset para limpiar la base de datos
          // await removeCategories({ id }, null, { transacting });

          // EN: Finally, delete the files from the provider
          // ES: Finalmente, eliminamos los archivos del proveedor
          await removeFiles(files, id, { userSession, transacting });
        }

        // EN: Remove all the users invited to the asset (if no permissions, it will throw an error)
        // ES: Eliminar todos los usuarios invitados al activo (si no tiene permisos, lanzará un error)
        await removeAllUsers(id, { userSession, transacting });
        return true;
      } catch (e) {
        // EN: The asset doesn't exist, so we don't need to do anything
        // ES: El asset no existe, por lo que no necesitamos hacer nada
        if (e.message === 'entry.notFound') {
          return false;
        }
        throw new Error(`Failed to remove asset: ${e.message}`);
      }
    },
    table,
    t
  );
};
