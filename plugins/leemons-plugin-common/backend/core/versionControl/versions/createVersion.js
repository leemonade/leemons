const { LeemonsError } = require('leemons-error');
const get = require('../currentVersions/get');
const { parseId, parseVersion } = require('../helpers');
const getVersion = require('./getVersion');

module.exports = async function createVersion({ id, version, published = false, ctx }) {
  const { uuid, version: v, fullId } = await parseId({ id: { id, version }, ctx });
  const { major, minor, patch } = parseVersion({ v, ctx });

  // EN: Check if uuid exists
  // ES: Comprueba si el uuid existe
  try {
    await get({ uuid, ctx });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: "The uuid doesn't exist in the version control system or you don't have permissions",
    });
  }

  try {
    const existingVersion = await getVersion({ id: { id: fullId, version: v }, ctx });
    if (existingVersion) {
      throw new LeemonsError(ctx, { message: 'Version already exists' });
    }
  } catch (e) {
    if (e.message === 'Version already exists') {
      throw e;
    }
    // EN: The version does not exists, so we can create it
    // ES: La versión no existe, por lo que se puede crear
  }

  await ctx.tx.db.Versions.create({
    uuid,
    major,
    minor,
    patch,
    published: Boolean(published),
  });

  return parseId({ id: { id: uuid, version }, ctx });
};
