const get = require('../currentVersions/get');
const { parseId, parseVersion } = require('../helpers');

module.exports = async function removeVersion({ id, published, version, ctx }) {
  const { uuid, version: v } = await parseId({ id: { id, version }, verifyVersion: false, ctx });
  const query = { uuid };

  // EN: Verify ownership (get throws an error if not owned)
  // ES: Verificar propiedad (get lanza un error si no es propiedad)
  await get({ uuid, ctx });

  // EN: If version is 'all', remove all versions.
  // ES: Si la versión es 'all', elimina todas las versiones.
  if (version !== 'all') {
    const { major, minor, patch } = parseVersion({ version: v, ctx });
    query.major = major;
    query.minor = minor;
    query.patch = patch;
  }

  if (published !== undefined) {
    // EN: Remove only if published state is the same
    // ES: Solo se elimina si el estado es el mismo
    query.published = published;
  }

  return ctx.tx.db.Versions.deleteMany(query);
};
