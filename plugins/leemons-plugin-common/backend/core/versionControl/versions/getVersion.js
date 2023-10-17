const { LeemonsError } = require('@leemons/error');
const get = require('../currentVersions/get');
const { parseId, parseVersion, stringifyVersion, stringifyId } = require('../helpers');

const specialVersions = ['latest', 'current', 'published', 'draft'];

async function getVersionMany({ ids, published, ignoreMissing = false, ctx }) {
  const parsedIds = await parseId({ id: ids, verifyVersion: false, ctx });

  const uuids = parsedIds.map((id) => id.uuid);

  // EN: Verify ownership (get throws an error if not owned)
  // ES: Verificar propiedad (get lanza un error si no es propiedad)

  const uuidsInfo = await get({ uuid: uuids, ctx });

  const query = {};
  let sortQuery = {};

  // TODO: Add more difficult searches (between versions, greather than, etc)
  query.$or = parsedIds.map(({ version, uuid }) => {
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

    return { uuid, version: finalVersion, fullId, published: Boolean(versionFound.published) };
  });
}

module.exports = async function getVersion({ id, published, ignoreMissing, ctx }) {
  const isArray = Array.isArray(id);
  const ids = isArray ? id : [id];

  const idVerions = await getVersionMany({ ids, published, ignoreMissing, ctx });

  return isArray ? idVerions : idVerions[0];
};
