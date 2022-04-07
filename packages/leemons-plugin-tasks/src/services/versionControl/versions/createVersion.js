const { versions } = require('../../table');
const { stringifyId, parseId, parseVersion } = require('../helpers');
const getVersion = require('./getVersion');

module.exports = async function createVersion(
  id,
  { version, published = false, transacting } = {}
) {
  const { uuid, version: v, fullId } = await parseId(id, version);
  const { major, minor, patch } = parseVersion(v);

  // TODO: Check if uuid exists

  try {
    const existingVersion = await getVersion(fullId, { v, transacting });

    if (existingVersion) {
      throw new Error('Version already exists');
    }
  } catch (e) {
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

  return stringifyId(uuid, version);
};
