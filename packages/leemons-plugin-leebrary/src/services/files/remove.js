const fs = require('fs/promises');
const { unlink: unlinkFiles } = require('../assets/files/unlink');
const { tables } = require('../tables');
const { normalizeItemsArray } = require('../shared');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Unlink the file from the asset and delete it from the provider and database
 * 
 * @param {Object} params - The params for deletion
 * @param {Object} params.file - The file to be deleted
 * @param {string} params.assetId - The id of the asset
 * @param {boolean} params.soft - Whether to soft delete the file
 * @param {Object} params.transacting - The transaction object
 * @returns {Promise<boolean>} - Returns true if the file is successfully deleted
 */
async function deleteFile({ file, assetId, soft, transacting }) {
  // EN: Delete the file from the provider
  // ES: Eliminar el archivo del proveedor

  if (file.provider === 'sys') {
    await fs.unlink(file.uri);
  } else {
    const provider = leemons.getProvider(file.provider);
    if (provider?.services?.provider?.remove) {
      await provider.services.provider.remove(file.uri, { soft, transacting });
    }
  }

  // EN: Delete the file entry from the database
  // ES: Eliminar la entrada del archivo de la base de datos
  await tables.assetsFiles.deleteMany({ file: file.id, asset: assetId }, { soft, transacting });
  await tables.files.deleteMany({ id: file.id }, { soft, transacting });

  return true;
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Remove files from the system
 * 
 * @param {Array|string} fileIds - The ids of the files to be removed
 * @param {string} assetId - The id of the asset
 * @param {Object} options - The options for removal
 * @param {boolean} options.soft - Whether to soft delete the files
 * @param {Object} options.userSession - The user session object
 * @param {Object} options.transacting - The transaction object
 * @returns {Promise<number>} - Returns the number of files successfully removed
 */
async function remove(fileIds, assetId, { soft, userSession, transacting } = {}) {
  const files = await tables.files.find({ id_$in: normalizeItemsArray(fileIds) });

  // EN: Unlink the file from the asset
  // ES: Desvincular el archivo del asset
  await unlinkFiles(
    files.map((file) => file.id),
    assetId,
    { userSession, soft, transacting }
  );

  const deleted = await Promise.all(
    files.map((file) => deleteFile({ file, assetId, soft, transacting }))
  );

  return deleted.reduce((acc, curr) => acc + (curr === true), 0);
}

module.exports = { remove };
