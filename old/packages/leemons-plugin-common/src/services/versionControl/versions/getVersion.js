const {
  table: { versions },
} = require('../../tables');
const get = require('../currentVersions/get');
const { parseId, parseVersion, stringifyVersion, stringifyId } = require('../helpers');

const specialVersions = ['latest', 'current', 'published', 'draft'];

async function getVersionMany(ids, { published, transacting, ignoreMissing = false } = {}) {
  const parsedIds = await parseId(ids, { verifyVersion: false, transacting });

  const uuids = parsedIds.map((id) => id.uuid);

  // EN: Verify ownership (get throws an error if not owned)
  // ES: Verificar propiedad (get lanza un error si no es propiedad)
  const uuidsInfo = await get.call(this, uuids, { transacting });

  const query = {};

  // TODO: Add more difficult searches (between versions, greather than, etc)
  query.$or = parsedIds.map(({ version, uuid }) => {
    const subQuery = {
      uuid,
    };

    if (published !== undefined) {
      subQuery.published = published;
    }

    if (['latest', 'published', 'draft'].includes(version)) {
      query.$sort = 'major:DESC,minor:DESC,patch:DESC';

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

      const { major, minor, patch } = parseVersion(v);

      subQuery.major = major;
      subQuery.minor = minor;
      subQuery.patch = patch;
    }

    return subQuery;
  });

  const versionsFound = (await versions.find(query, { transacting })).map((version) => ({
    ...version,
    version: stringifyVersion(version),
  }));

  if (!versionsFound?.length && !ignoreMissing) {
    throw new Error('Versions not found');
  }

  return parsedIds.map(({ version, uuid }) => {
    const isSpecialVersion = specialVersions.includes(version);
    const versionFound = versionsFound.find(
      (v) => v.uuid === uuid && (isSpecialVersion || v.version === version)
    );

    if (!versionFound) {
      if (!ignoreMissing) {
        throw new Error('Versions not found');
      } else {
        return null;
      }
    }

    const finalVersion = stringifyVersion(versionFound);
    const fullId = stringifyId(uuid, finalVersion);

    return { uuid, version: finalVersion, fullId, published: Boolean(versionFound.published) };
  });
}

module.exports = async function getVersion(id, { published, transacting, ignoreMissing } = {}) {
  const isArray = Array.isArray(id);
  const ids = isArray ? id : [id];

  const idVerions = await getVersionMany.call(this, ids, { published, transacting, ignoreMissing });

  return isArray ? idVerions : idVerions[0];
};
