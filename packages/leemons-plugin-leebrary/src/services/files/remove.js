const { isArray } = require('lodash');
const fs = require('fs/promises');
const { unlink: unlinkFiles } = require('../assets/files/unlink');
const { tables } = require('../tables');

async function remove(fileIds, assetId, { soft, userSession, transacting } = {}) {
  const files = await tables.files.find({ id_$in: isArray(fileIds) ? fileIds : [fileIds] });

  // EN: Unlink the file from the asset
  // ES: Desvincular el archivo del asset
  await unlinkFiles(
    files.map((file) => file.id),
    assetId,
    { userSession, soft, transacting }
  );

  const deleted = await Promise.all(
    files.map(async (file) => {
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
    })
  );

  return deleted.reduce((acc, curr) => acc + (curr === true), 0);
}

module.exports = { remove };
