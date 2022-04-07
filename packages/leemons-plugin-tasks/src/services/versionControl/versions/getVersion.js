const { versions } = require('../../table');
const { parseId, parseVersion } = require('../helpers');

module.exports = async function getVersion(id, { published = true, version, transacting } = {}) {
  const { uuid, version: v } = await parseId(id, version, { verifyVersion: false });
  const query = {
    uuid,
    published,
    $limit: 1,
  };

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

  const results = versions.find(query, { transacting });

  if (results?.length) {
    return results[0];
  }

  throw new Error('Version not found');
};
