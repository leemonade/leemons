const {
  table: { currentVersions },
} = require('../../tables');
const verifyOwnership = require('../helpers/type/verifyOwnership');

async function getMany(uuids, { transacting } = {}) {
  const versionedEntities = await currentVersions.find(
    {
      id_$in: uuids,
    },
    { transacting }
  );

  return versionedEntities.map((entity) => {
    if (!verifyOwnership(entity.type, this)) {
      throw new Error(
        `The uuid ${entity.id} does not exist in the version control system or you don't have permissions`
      );
    }

    return {
      uuid: entity.id,
      current: entity.published,
      type: entity.type,
    };
  });
}

module.exports = async function get(uuid, { transacting } = {}) {
  const isArray = Array.isArray(uuid);
  const uuids = isArray ? uuid : [uuid];

  const entities = await getMany.call(this, uuids, { transacting });

  return isArray ? entities : entities[0];
};
