const { LeemonsError } = require('leemons-error');
const isValidVersion = require('../versions/isValidVersion');
const stringifyVersion = require('../versions/stringifyVersion');
const stringifyId = require('./stringifyId');

const specialVersions = ['latest', 'current', 'published', 'draft'];

/**
 * Parses an array of IDs and versions, optionally verifies versions, and returns an array of parsed IDs.
 * If `ignoreMissing` is true, removes IDs with missing versions from the output.
 *
 * @param {Object} params - The parameters.
 * @param {Array.<(string|Object)>} params.ids - An array of IDs to parse. Each ID can be a string or an object of the form `{ id, version }`.
 * @param {boolean} [params.verifyVersion=true] - Whether to verify the version of each ID. If verification fails, an exception is thrown.
 * @param {boolean} [params.ignoreMissing=false] - Whether to ignore missing versions in the input. If true, IDs with missing versions are removed from the output.
 * @param {import('moleculer').Context} params.ctx - The moleculer context object, which must include a transaction object `tx` with a `call` method for retrieving version info.
 *
 * @returns {Promise.<Array.<Object>>} A promise that resolves to an array of parsed IDs. Each parsed ID is an object of the form `{ fullId, uuid, version }`.
 *
 * @throws {LeemonsError} If any ID is not a string or is empty, or if version verification fails.
 */

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

/**
 * Parses an ID or array of IDs and versions, optionally verifies versions, and returns a parsed ID or array of parsed IDs.
 * If `ignoreMissing` is true and the ID or any ID in the array has a missing version, the parsed ID or IDs with missing versions are not included in the output.
 *
 * @param {Object} params - The parameters.
 * @param {(string|Array.<(string|Object)>)} params.id - An ID or array of IDs to parse. Each ID can be a string or an object of the form `{ id, version }`.
 * @param {boolean} [params.verifyVersion=true] - Whether to verify the version of each ID. If verification fails, an exception is thrown.
 * @param {boolean} [params.ignoreMissing=false] - Whether to ignore missing versions in the input. If true, IDs with missing versions are removed from the output.
 * @param {import('moleculer').Context} params.ctx - The moleculer context object, which must include a transaction object `tx` with a `call` method for retrieving version info.
 *
 * @returns {Promise.<(Object|Array.<Object>)>} A promise that resolves to a parsed ID or array of parsed IDs. Each parsed ID is an object of the form `{ fullId, uuid, version }`.
 *
 * @throws {LeemonsError} If any ID is not a string or is empty, or if version verification fails.
 */

module.exports = async function parseId({ id, verifyVersion = true, ignoreMissing = false, ctx }) {
  const isArray = Array.isArray(id);
  const ids = isArray ? id : [id];

  const parsedIds = await parseIdMany({ ids, verifyVersion, ignoreMissing, ctx });

  if (isArray) {
    return parsedIds;
  }

  return parsedIds[0];
};
