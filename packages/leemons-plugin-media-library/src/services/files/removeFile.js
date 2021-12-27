const { table } = require('../tables');

async function removeFile(id, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const query = { id };
      if (userSession) query.fromUser = userSession.id;

      const file = await table.files.findOne(query, { transacting });
      // EN: First delete the file from the database so if it fails we don't have an entry without a file
      // ES: Primero eliminamos el archivo de la base de datos para que si falla no tengamos una entrada sin archivo
      await table.files.delete({ id }, { transacting });

      // Default provider
      if (file.provider === 'sys') {
        await leemons.fs.unlink(file.uri);

        // Other providers
      } else {
        const provider = leemons.getProvider(file.provider);
        if (provider?.services?.provider?.remove) {
          await provider.services.provider.remove(file.uri, { transacting });
        }
      }

      return true;
    },
    table.files,
    _transacting
  );
}

module.exports = { removeFile };
