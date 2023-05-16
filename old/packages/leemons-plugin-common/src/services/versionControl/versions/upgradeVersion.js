const semver = require('semver');
const { parseId, parseVersion } = require('../helpers');
const createVersion = require('./createVersion');
const {
  table: { versions },
} = require('../../tables');
const update = require('../currentVersions/update');

module.exports = async function upgradeVersion(
  id,
  upgrade = 'major',
  { published = false, version, transacting, setAsCurrent } = {}
) {
  const { uuid, version: v } = await parseId({ id, version });
  const versionObject = await parseVersion(v);

  const query = {
    uuid,
    $sort: 'major:DESC,minor:DESC,patch:DESC',
    $limit: 1,
  };

  if (upgrade === 'major') {
    query.major_$gt = versionObject.major;
    query.minor = 0;
    query.patch = 0;
  } else if (upgrade === 'minor') {
    query.major = versionObject.major;
    query.minor_$gt = versionObject.minor;
    query.patch = 0;
  } else if (upgrade === 'patch') {
    query.major = versionObject.major;
    query.minor = versionObject.minor;
    query.patch_$gt = versionObject.patch;
  } else {
    throw new Error(`Invalid upgrade type: ${upgrade}`);
  }

  // EN: Get the latest version grater than the current one.
  // ES: Obtiene la última versión mayor que la actual.
  const versionFound = await versions.find(query, { transacting });

  // EN: Get the next version, so we can update the current version.
  // ES: Obtiene la siguiente versión, para poder actualizar la versión actual.
  const newVersion = parseVersion(semver.inc(v, upgrade));

  // EN: If a greater one exists, create the new version.
  // ES: Si existe una mayor, crea la nueva versión.
  if (versionFound.length) {
    if (upgrade === 'major') {
      newVersion.major = versionFound[0].major + 1;
    } else if (upgrade === 'minor') {
      newVersion.minor = versionFound[0].minor + 1;
    } else if (upgrade === 'patch') {
      newVersion.patch = versionFound[0].patch + 1;
    }
  }

  // EN: Update the current version.
  // ES: Actualiza la versión actual.
  const createdVersion = await createVersion.bind(this)(uuid, {
    version: newVersion,
    published,
    transacting,
  });

  if (published && setAsCurrent) {
    await update.bind(this)(uuid, newVersion, { transacting });
  }

  return { ...createdVersion, published };
};
