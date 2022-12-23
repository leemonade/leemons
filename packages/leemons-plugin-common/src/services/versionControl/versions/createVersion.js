const {
  table: { versions },
} = require('../../tables');
const get = require('../currentVersions/get');
const { parseId, parseVersion } = require('../helpers');
const getVersion = require('./getVersion');

module.exports = async function createVersion(
  id,
  { version, published = false, transacting } = {}
) {
  const { uuid, version: v, fullId } = await parseId({ id, version });
  const { major, minor, patch } = parseVersion(v);

  // EN: Check if uuid exists
  // ES: Comprueba si el uuid existe
  try {
    await get.bind(this)(uuid, { transacting });
  } catch (e) {
    throw new Error(
      "The uuid doesn't exist in the version control system or you don't have permissions"
    );
  }

  try {
    const existingVersion = await getVersion.bind(this)(fullId, { v, transacting });

    if (existingVersion) {
      throw new Error('Version already exists');
    }
  } catch (e) {
    if (e.message === 'Version already exists') {
      throw e;
    }
    // EN: The version does not exists, so we can create it
    // ES: La versión no existe, por lo que se puede crear
  }

  await versions.create(
    {
      uuid,
      major,
      minor,
      patch,
      published: Boolean(published),
    },
    { transacting }
  );

  return parseId({ id: uuid, version });
};
