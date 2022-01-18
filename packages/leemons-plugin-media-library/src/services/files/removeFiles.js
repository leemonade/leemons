const unlinkFiles = require('../assets/files/unlinkFiles');
const { files: table } = require('../tables');

module.exports = async function removeFile(files, asset, { userSession, transacting } = {}) {
  const _files = await table.find({ id_$in: files.length ? files : [files] });

  const deleted = await Promise.all(
    _files.map(async (file) => {
      // EN: Delete the file entry from the database
      // ES: Eliminar la entrada del archivo de la base de datos
      await table.deleteMany({ id: file.id }, { transacting });

      // EN: Unlink the file from the asset
      // ES: Desvincular el archivo del asset
      await unlinkFiles(files, asset, { userSession, transacting });

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
};
