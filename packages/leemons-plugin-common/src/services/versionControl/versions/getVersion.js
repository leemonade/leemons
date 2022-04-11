const { versions } = require('../../tables');
const { get } = require('../currentVersions');
const { parseId, parseVersion } = require('../helpers');

module.exports = async function getVersion(id, { published, version, transacting } = {}) {
  const { uuid, version: v, fullId } = await parseId(id, version, { verifyVersion: false });
  const query = {
    uuid,
    $limit: 1,
  };

  // EN: Verify ownership (get throws an error if not owned)
  // ES: Verificar propiedad (get lanza un error si no es propiedad)
  await get.bind(this)(uuid, { transacting });

  if (published !== undefined) {
    query.published = published;
  }
  if (v === 'latest') {
    query.$sort = 'major:DESC,minor:DESC,patch:DESC';
  } else if (v === 'current') {
    // TODO: Get the current version from currentVersions
    throw new Error('Not implemented');
  } else {
    const { major, minor, patch } = parseVersion(v);
    query.major = major;
    query.minor = minor;
    query.patch = patch;
  }

  // TODO: Add more difficult searches (between versions, greather than, etc)

  const results = await versions.find(query, { transacting });

  if (results?.length) {
    return { uuid, version: v, fullId, published: Boolean(results[0].published) };
  }

  throw new Error('Version not found');
};
