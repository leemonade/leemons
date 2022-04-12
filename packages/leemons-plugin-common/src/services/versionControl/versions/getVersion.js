const {
  table: { versions },
} = require('../../tables');
const get = require('../currentVersions/get');
const { parseId, parseVersion, stringifyVersion, stringifyId } = require('../helpers');

module.exports = async function getVersion(id, { published, version, transacting } = {}) {
  const { uuid, version: v } = await parseId(id, version, { verifyVersion: false });

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

  if (v === 'latest' || v === 'published' || v === 'draft') {
    query.$sort = 'major:DESC,minor:DESC,patch:DESC';

    if (v === 'published') {
      query.published = true;
    } else if (v === 'draft') {
      query.published = false;
    }
  } else if (v === 'current') {
    const { current } = await get(uuid, { transacting });
    const { major, minor, patch } = parseVersion(current);
    query.major = major;
    query.minor = minor;
    query.patch = patch;
  } else {
    const { major, minor, patch } = parseVersion(v);
    query.major = major;
    query.minor = minor;
    query.patch = patch;
  }

  // TODO: Add more difficult searches (between versions, greather than, etc)

  const results = await versions.find(query, { transacting });

  if (results?.length) {
    const finalVersion = stringifyVersion(results[0]);
    const fullId = await stringifyId(uuid, finalVersion);

    return { uuid, version: finalVersion, fullId, published: Boolean(results[0].published) };
  }

  throw new Error('Version not found');
};
