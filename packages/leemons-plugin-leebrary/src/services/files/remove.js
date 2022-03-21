const { isArray } = require('lodash');
const { unlink: unlinkFiles } = require('../assets/files/unlink');
const { tables } = require('../tables');

async function remove(fileIds, assetId, { userSession, transacting } = {}) {
  const files = await tables.files.find({ id_$in: isArray(fileIds) ? fileIds : [fileIds] });

  const deleted = await Promise.all(
    files.map(async (file) => {
      // EN: Delete the file entry from the database
      // ES: Eliminar la entrada del archivo de la base de datos
      await tables.files.deleteMany({ id: file.id }, { transacting });

      // EN: Unlink the file from the asset
      // ES: Desvincular el archivo del asset
      await unlinkFiles(files, assetId, { userSession, transacting });

      // EN: Delete the file from the provider
      // ES: Eliminar el archivo del proveedor

      if (file.provider === 'sys') {
        await leemons.fs.unlink(file.uri);
      } else {
        const provider = leemons.getProvider(file.provider);
        if (provider?.services?.provider?.remove) {
          await provider.services.provider.remove(file.uri, { transacting });
        }
      }

      return true;
    })
  );

  return deleted.reduce((acc, curr) => acc + (curr === true), 0);
}

module.exports = { remove };
