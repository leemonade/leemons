const semver = require('semver');
const LeemonsError = require('leemons-error');
const { parseId, parseVersion } = require('../helpers');
const createVersion = require('./createVersion');
const update = require('../currentVersions/update');

module.exports = async function upgradeVersion({
  id,
  upgrade = 'major',
  published = false,
  version,
  setAsCurrent,
  ctx,
}) {
  const { uuid, version: v } = await parseId({ id: { id, version }, ctx });
  const versionObject = await parseVersion({ version: v, ctx });

  const query = {
    uuid,
  };

  const querySort = { major: 'desc', minor: 'desc', patch: 'desc' };
  const queryLimit = 1;

  if (upgrade === 'major') {
    query.major = { $gt: versionObject.major };
    query.minor = 0;
    query.patch = 0;
  } else if (upgrade === 'minor') {
    query.major = versionObject.major;
    query.minor = { $gt: versionObject.minor };
    query.patch = 0;
  } else if (upgrade === 'patch') {
    query.major = versionObject.major;
    query.minor = versionObject.minor;
    query.patch = { $gt: versionObject.patch };
  } else {
    throw new LeemonsError(ctx, { message: `Invalid upgrade type: ${upgrade}` });
  }

  // EN: Get the latest version grater than the current one.
  // ES: Obtiene la última versión mayor que la actual.
  const versionFound = await ctx.tx.db.Versions.find(query)
    .sort(querySort)
    .limit(queryLimit)
    .lean();

  // EN: Get the next version, so we can update the current version.
  // ES: Obtiene la siguiente versión, para poder actualizar la versión actual.

  const newVersion = parseVersion({ version: semver.inc(v, upgrade), ctx });

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
  const createdVersion = await createVersion({ id: uuid, version: newVersion, published, ctx });

  if (published && setAsCurrent) {
    await update({ uuid, version: newVersion, ctx });
  }

  return { ...createdVersion, published };
};
