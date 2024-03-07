const _ = require('lodash');
const list = require('../currentVersions/list');
const { parseId, stringifyId, stringifyVersion } = require('../helpers');
const getVersion = require('./getVersion');

function getDesiredVersion({ current, published, preferCurrent }) {
  if (current && preferCurrent && (published === true || published === 'all')) {
    return current;
  }

  if (published === 'all') {
    return 'latest';
  }

  if (published === false) {
    return 'draft';
  }
  return 'published';
}

module.exports = async function listVersionOfType({
  type,
  allVersions = false,
  published = 'all',
  preferCurrent = true,
  ctx,
}) {
  const listOfEntities = await list({ type, ctx });

  if (allVersions) {
    const foundVersions = await ctx.tx.db.Versions.find({
      uuid: listOfEntities.map((entity) => entity.uuid),
    }).lean();

    const fullIds = foundVersions.map((v) =>
      stringifyId({ id: v.uuid, version: stringifyVersion({ ...v, ctx }, ctx) })
    );

    const result = await getVersion({ id: fullIds, ignoreMissing: true, ctx });

    return _.compact(result);
  }

  const parsedIds = (
    await parseId({
      id: listOfEntities.map((entity) => ({
        id: entity.uuid,
        version: getDesiredVersion({ current: entity.current, published, preferCurrent }),
      })),
      ignoreMissing: true,
      ctx,
    })
  ).filter(Boolean);
  const result = await getVersion({ id: parsedIds.map((id) => id.fullId), ctx });
  return _.compact(result);
};
