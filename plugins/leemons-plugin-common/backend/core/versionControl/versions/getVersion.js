const { LeemonsError } = require('@leemons/error');
const { keyBy } = require('lodash');

const get = require('../currentVersions/get');
const { parseId, parseVersion, stringifyVersion, stringifyId } = require('../helpers');

const specialVersions = ['latest', 'current', 'published', 'draft'];

async function getVersionsInfo({ ids, published, ignoreMissing, uuidsInfo, ctx }) {
  const query = {};
  let sortQuery = {};

  // TODO: Add more difficult searches (between versions, greather than, etc)
  query.$or = ids.map(({ version, uuid }) => {
    const subQuery = {
      uuid,
    };
    if (published !== undefined) {
      subQuery.published = published;
    }

    if (['latest', 'published', 'draft'].includes(version)) {
      sortQuery = { major: 'desc', minor: 'desc', patch: 'desc' };

      if (version === 'published') {
        subQuery.published = true;
      } else if (version === 'draft') {
        subQuery.published = false;
      }
    } else {
      let v = version;

      if (version === 'current') {
        const { current } = uuidsInfo.find((info) => info.uuid === uuid);
        v = current;
      }

      const { major, minor, patch } = parseVersion({ version: v, ctx });

      subQuery.major = major;
      subQuery.minor = minor;
      subQuery.patch = patch;
    }
    return subQuery;
  });

  // If sortQuery is empty the query won't be sort.
  const versionsFound = (await ctx.tx.db.Versions.find(query).sort(sortQuery).lean()).map(
    (version) => ({
      ...version,
      version: stringifyVersion({ ...version, ctx }),
    })
  );

  if (!versionsFound?.length && !ignoreMissing) {
    throw new LeemonsError(ctx, { message: 'Versions not found' });
  }

  return versionsFound;
}

async function getLatestVersion({ versions, ctx }) {
  const pipeline = [
    {
      $match: {
        uuid: { $in: versions },
        deploymentID: ctx.meta.deploymentID,
        isDeleted: false,
      },
    },
    {
      $sort: { major: -1, minor: -1, patch: -1 },
    },
    {
      $group: {
        _id: '$uuid',
        major: { $first: '$major' },
        minor: { $first: '$minor' },
        patch: { $first: '$patch' },
      },
    },
  ];

  const latestVersions = await ctx.tx.db.Versions.aggregate(pipeline);

  return keyBy(latestVersions, '_id');
}

async function getCurrentInfo({ versions, uuidsInfo, ctx }) {
  const uuidsInfoByUuid = keyBy(uuidsInfo, 'uuid');
  const uuids = Object.keys(uuidsInfoByUuid);

  const latestVersions = await getLatestVersion({
    versions: uuids,
    ctx,
  });

  return versions.map((version) => {
    const latestVersion = latestVersions[version.uuid]
      ? stringifyVersion({
          ...latestVersions[version.uuid],
          ctx,
        })
      : null;

    return {
      ...version,
      isLatestVersion: latestVersion === version.version,
    };
  });
}

async function getVersionMany({
  ids,
  published,
  ignoreMissing = false,
  getLatestInfo = false,
  ctx,
}) {
  if (!ids.length) return [];
  const parsedIds = await parseId({ id: ids, verifyVersion: false, ctx });

  const uuids = parsedIds.map((id) => id.uuid);

  // EN: Verify ownership (get throws an error if not owned)
  // ES: Verificar propiedad (get lanza un error si no es propiedad)
  const uuidsInfo = await get({ uuid: uuids, ctx });

  let versionsFound = await getVersionsInfo({
    ids: parsedIds,
    published,
    ignoreMissing,
    uuidsInfo,
    ctx,
  });

  if (getLatestInfo) {
    versionsFound = await getCurrentInfo({ versions: versionsFound, uuidsInfo, ctx });
  }

  return parsedIds.map(({ version, uuid }) => {
    const isSpecialVersion = specialVersions.includes(version);
    const versionFound = versionsFound.find(
      (v) => v.uuid === uuid && (isSpecialVersion || v.version === version)
    );

    if (!versionFound) {
      if (!ignoreMissing) {
        throw new LeemonsError(ctx, { message: 'Versions not found' });
      } else {
        return null;
      }
    }

    const finalVersion = stringifyVersion({ ...versionFound, ctx });
    const fullId = stringifyId({ id: uuid, version: finalVersion, ctx });

    const response = {
      uuid,
      version: finalVersion,
      fullId,
      published: Boolean(versionFound.published),
    };

    if (getLatestInfo) {
      response.isLatestVersion = versionFound.isLatestVersion;
    }

    return response;
  });
}

module.exports = async function getVersion({ id, published, ignoreMissing, getLatestInfo, ctx }) {
  const isArray = Array.isArray(id);
  const ids = isArray ? id : [id];

  const idVerions = await getVersionMany({
    ids,
    published,
    ignoreMissing,
    getLatestInfo,
    ctx,
  });

  return isArray ? idVerions : idVerions[0];
};
