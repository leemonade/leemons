const { table } = require('../tables');

async function removeFile(id, { userSession, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const query = { id };
      if (userSession) query.fromUser = userSession.id;

      const file = await table.files.findOne(query, { transacting });

      if (file.provider === 'sys') {
        await leemons.fs.unlink(file.url);
      } else {
        const provider = leemons.getProvider(file.provider);
        if (
          provider &&
          provider.services &&
          provider.services.provider &&
          provider.services.provider.remove
        ) {
          await provider.services.provider.remove(file.url, { transacting });
        }
      }

      await table.files.delete({ id }, { transacting });

      return true;
    },
    table.files,
    _transacting
  );
}

module.exports = { removeFile };
