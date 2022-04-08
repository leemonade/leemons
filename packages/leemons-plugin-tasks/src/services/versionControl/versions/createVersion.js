const { versions } = require('../../table');
const get = require('../currentVersions/get');
const { parseId, parseVersion } = require('../helpers');
const getVersion = require('./getVersion');

module.exports = async function createVersion(
  id,
  { version, published = false, transacting } = {}
) {
  const { uuid, version: v, fullId } = await parseId(id, version);
  const { major, minor, patch } = parseVersion(v);

  // TODO: Check if uuid exists
  try {
    await get(uuid, { transacting });
  } catch (e) {
    throw new Error("The uuid doesn't exist in the version control system");
  }

  try {
    const existingVersion = await getVersion(fullId, { v, transacting });

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
      published,
    },
    { transacting }
  );

  return parseId(uuid, version);
};
