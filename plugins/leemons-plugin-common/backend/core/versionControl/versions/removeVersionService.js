const { LeemonsError } = require('@leemons/error');
const get = require('../currentVersions/get');
const { parseId } = require('../helpers');
const removeVersion = require('./removeVersion');

module.exports = async function removeVersionService({ id, published, version, ctx }) {
  const {
    uuid,
    version: v,
    fullId,
  } = await parseId({ id: { id, version }, verifyVersion: false, ctx });

  try {
    const { current } = await get({ uuid, ctx });
    if (version !== 'all' && current === v) {
      // EN: Check if current version is the same as the version to remove
      // ES: Comprueba si la versión actual es la misma que la versión a eliminar
      throw new LeemonsError(ctx, { message: 'isCurrentVersion' });
    } else if (version === 'all' && current) {
      // EN: Check if the uuid has a current version
      // ES: Comprueba si el uuid tiene una versión actual
      throw new LeemonsError(ctx, { message: 'isCurrentVersion' });
    }
  } catch (e) {
    if (e.message === 'isCurrentVersion') {
      throw new LeemonsError(ctx, { message: "Can't remove current version" });
    }
    throw new LeemonsError(ctx, {
      message:
        "The requested uuid does not exist in the version control system or you don' have permissions",
    });
  }

  return removeVersion({ id: fullId, published, ctx });
};
