const removeFiles = require('../files/removeFiles');
// const removeCategories = require('../files/categories/remove');
const { assets: table } = require('../tables');
const getFiles = require('./files/getFiles');
const unlinkFiles = require('./files/unlinkFiles');

module.exports = async function removeAsset(id, { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      try {
        // EN: Check if the asset exists (if not it will throw an error)
        // ES: Comprobar si el activo existe (si no, lanzará un error)
        await table.findOne({ id }, { transacting });

        // EN: Get the files associated with the asset
        // ES: Obtener los archivos asociados al asset
        const files = await getFiles(id, { transacting });

        // EN: First delete the file from the database so if it fails we don't have an entry without a file
        // ES: Primero eliminamos el archivo de la base de datos para que si falla no tengamos una entrada sin archivo
        await table.delete({ id }, { transacting });

        // EN: Unlink the files from the asset
        // ES: Desvincular los archivos del asset
        if (files.length) {
          await unlinkFiles(files, id, { transacting });

          // EN: We also need to delete the asset's categories
          // ES: También debemos eliminar las categorías del archivo
          // await removeCategories({ id }, null, { transacting });

          // EN: Finally, delete the file from the provider
          // ES: Finalmente, eliminamos el archivo del proveedor
          await removeFiles(files, { transacting });
        }
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
