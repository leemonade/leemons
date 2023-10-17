const fs = require('fs/promises');
const { getByName: getProviderByName } = require('../../providers/getByName');
/**
 * Unlink the file from the asset and delete it from the provider and database
 *
 * @param {Object} params - The params object
 * @param {Object} params.file - The file to be deleted
 * @param {string} params.assetId - The id of the asset
 * @param {boolean} params.soft - Whether to soft delete the file
 * @param {Object} params.transacting - The transaction object
 * @returns {Promise<boolean>} - Returns true if the file is successfully deleted
 */
async function deleteFile({ file, assetId, soft, ctx }) {
  // EN: Delete the file from the provider
  // ES: Eliminar el archivo del proveedor
  if (file.provider === 'sys') {
    await fs.unlink(file.uri);
  } else {
    const provider = await getProviderByName({ name: file.provider, ctx });

    if (provider?.supportedMethods?.remove) {
      await ctx.tx.call(`${file.provider}.files.remove`, {
        key: file.uri,
        soft,
      });
    }
  }

  // EN: Delete the file entry from the database
  // ES: Eliminar la entrada del archivo de la base de datos
  await ctx.tx.db.AssetsFiles.deleteMany({ file: file.id, asset: assetId }, { soft });
  await ctx.tx.db.Files.deleteMany({ id: file.id }, { soft });

  return true;
}

module.exports = { deleteFile };
