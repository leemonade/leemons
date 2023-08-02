const { LeemonsError } = require('leemons-error');
const verifyOwnership = require('../helpers/type/verifyOwnership');

async function getMany({ uuids, ctx }) {
  const versionedEntities = await ctx.tx.db.CurrentVersions.find({
    id: uuids,
  }).lean();

  return versionedEntities.map((entity) => {
    if (!verifyOwnership({ type: entity.type, ctx })) {
      throw new LeemonsError(ctx, {
        message: `The uuid ${entity.id} does not exist in the version control system or you don't have permissions`,
      });
    }

    return {
      uuid: entity.id,
      current: entity.published,
      type: entity.type,
    };
  });
}

module.exports = async function get({ uuid, ctx }) {
  const isArray = Array.isArray(uuid);
  const uuids = isArray ? uuid : [uuid];

  const entities = await getMany({ uuids, ctx });

  return isArray ? entities : entities[0];
};
