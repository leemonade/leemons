const { LeemonsError } = require('leemons-error');
const isValidVersion = require('../versions/isValidVersion');
const stringifyVersion = require('../versions/stringifyVersion');
const stringifyId = require('./stringifyId');

const specialVersions = ['latest', 'current', 'published', 'draft'];

async function parseIdMany({ ids, verifyVersion = true, ignoreMissing, ctx }) {
  const parsedIds = ids.map((fullId) => {
    const fullIdIsString = typeof fullId === 'string';
    const id = fullIdIsString ? fullId : fullId.id;
    const _version = fullIdIsString ? null : fullId.version ?? null;

    if (typeof id !== 'string' || !id?.length) {
      throw new LeemonsError(ctx, { message: 'fullId must be a string' });
    }

    // eslint-disable-next-line prefer-const
    let [uuid, version] = id.split('@');

    if (_version) {
      version = _version;
      if (typeof _version !== 'string') {
        try {
          version = stringifyVersion({ ..._version, ctx });
        } catch (e) {
          if (verifyVersion) {
            throw e;
          }
        }
      }
    }

    return {
      fullId: stringifyId({ id: uuid, version, verifyVersion, ctx }),
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
    const versionsInfo = await ctx.tx.call('common.versionControl.getVersion', {
      id: idsWithSpecialVersions.map((v) => v.fullId),
      ignoreMissing,
    });

    versionsInfo.forEach((info, i) => {
      if (!info && ignoreMissing) {
        parsedIds.splice(
          parsedIds.findIndex((id) => id === idsWithSpecialVersions[i]),
          1
        );
        return;
      }

      if (!isValidVersion({ version: info.version, ctx })) {
        throw new LeemonsError(ctx, { message: 'The provided version must be valid' });
      }

      idsWithSpecialVersions[i].version = info.version;
      idsWithSpecialVersions[i].fullId = info.fullId;
    });
  }

  return parsedIds;
}

module.exports = async function parseId({ id, verifyVersion = true, ignoreMissing = false, ctx }) {
  const isArray = Array.isArray(id);
  const ids = isArray ? id : [id];

  const parsedIds = await parseIdMany({ ids, verifyVersion, ignoreMissing, ctx });

  if (isArray) {
    return parsedIds;
  }

  return parsedIds[0];
};
