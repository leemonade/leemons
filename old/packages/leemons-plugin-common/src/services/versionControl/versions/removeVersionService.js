const get = require('../currentVersions/get');
const { parseId } = require('../helpers');
const removeVersion = require('./removeVersion');

module.exports = async function removeVersionService(id, { published, version, transacting } = {}) {
  const { uuid, version: v, fullId } = await parseId({ id, version }, { verifyVersion: false });

  try {
    const { current } = await get.bind(this)(uuid, { transacting });
    if (version !== 'all' && current === v) {
      // EN: Check if current version is the same as the version to remove
      // ES: Comprueba si la versión actual es la misma que la versión a eliminar
      throw new Error('isCurrentVersion');
    } else if (version === 'all' && current) {
      // EN: Check if the uuid has a current version
      // ES: Comprueba si el uuid tiene una versión actual
      throw new Error('isCurrentVersion');
    }
  } catch (e) {
    if (e.message === 'isCurrentVersion') {
      throw new Error("Can't remove current version");
    }
    throw new Error(
      "The requested uuid does not exist in the version control system or you don' have permissions"
    );
  }

  return removeVersion.bind(this)(fullId, { published, transacting });
};
