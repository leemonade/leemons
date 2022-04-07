const { versions } = require('../../table');
const { stringifyId, parseId, parseVersion } = require('../helpers');
const getVersion = require('./getVersion');

module.exports = async function createVersion(
  id,
  { version, published = false, transacting } = {}
) {
  const { uuid, v } = await parseId(id, version);
  const { major, minor, patch } = parseVersion(v);

  // TODO: Check if uuid exists

  const existingVersion = await getVersion(id, { v, transacting });

  if (existingVersion) {
    throw new Error('Version already exists');
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
