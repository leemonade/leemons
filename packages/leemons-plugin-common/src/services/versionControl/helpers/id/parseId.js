const isValidVersion = require('../versions/isValidVersion');
const stringifyVersion = require('../versions/stringifyVersion');
const stringifyId = require('./stringifyId');

const specialVersions = ['latest', 'current', 'published', 'draft'];

async function parseIdMany(ids, { verifyVersion = true, transacting, ignoreMissing } = {}) {
  const parsedIds = ids.map((fullId) => {
    const fullIdIsString = typeof fullId === 'string';
    const id = fullIdIsString ? fullId : fullId.id;
    const _version = fullIdIsString ? null : fullId.version ?? null;

    if (typeof id !== 'string' || !id?.length) {
      throw new Error('fullId must be a string');
    }

    // eslint-disable-next-line prefer-const
    let [uuid, version] = id.split('@');

    if (_version) {
      version = _version;
      if (typeof _version !== 'string') {
        try {
          version = stringifyVersion(_version);
        } catch (e) {
          if (verifyVersion) {
            throw e;
          }
        }
      }
    }

    return {
      fullId: stringifyId(uuid, version, { verifyVersion }),
      uuid,
      version,
    };
  });

  if (!verifyVersion) {
    return parsedIds;
  }

  const idsWithSpecialVersions = parsedIds.filter(({ version }) =>
    specialVersions.includes(version)
  );

  if (idsWithSpecialVersions?.length) {
    // eslint-disable-next-line global-require
    const getVersion = require('../../versions/getVersion');

    const versionsInfo = await getVersion.call(
      { calledFrom: 'plugins.common' },
      idsWithSpecialVersions.map((v) => v.fullId),
      {
        ignoreMissing,
        transacting,
      }
    );

    versionsInfo.forEach((info, i) => {
      if (!info && ignoreMissing) {
        parsedIds.splice(
          parsedIds.findIndex((id) => id === idsWithSpecialVersions[i]),
          1
        );
        return;
      }

      if (!isValidVersion(info.version)) {
        throw new Error('The provided version must be valid');
      }

      idsWithSpecialVersions[i].version = info.version;
      idsWithSpecialVersions[i].fullId = info.fullId;
    });
  }

  return parsedIds;
}

module.exports = async function parseId(
  id,
  { verifyVersion = true, transacting, ignoreMissing = false } = {}
) {
  const isArray = Array.isArray(id);
  const ids = isArray ? id : [id];

  const parsedIds = await parseIdMany.call(this, ids, {
    verifyVersion,
    transacting,
    ignoreMissing,
  });

  if (isArray) {
    return parsedIds;
  }

  return parsedIds[0];
};
