const removeFile = require('../files/removeFile');
const removeCategories = require('../files/categories/remove');
const { files: table } = require('../tables');

module.exports = async function removeAsset(id, { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      try {
        const file = await table.findOne({ id }, { transacting });

        // EN: First delete the file from the database so if it fails we don't have an entry without a file
        // ES: Primero eliminamos el archivo de la base de datos para que si falla no tengamos una entrada sin archivo
        await table.delete({ id }, { transacting });

        // EN: We also need to delete the asset's categories
        // ES: También debemos eliminar las categorías del archivo
        await removeCategories({ id }, null, { transacting });

        // EN: Finally, delete the file from the provider
        // ES: Finalmente, eliminamos el archivo del proveedor
        await removeFile(file, { transacting });

        return true;
      } catch (e) {
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
