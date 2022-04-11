const { currentVersions } = require('../../tables');
const verifyOwnership = require('../helpers/type/verifyOwnership');

module.exports = async function get(uuid, { transacting } = {}) {
  try {
    const versionedEntity = await currentVersions.findOne(
      {
        id: uuid,
      },
      { transacting }
    );

    const { type } = versionedEntity;

    if (!verifyOwnership(type, this)) {
      throw new Error('You are not allowed to access this version');
    }

    return { uuid: versionedEntity.id, current: versionedEntity.published };
  } catch (e) {
    throw new Error(
      `The uuid ${uuid} does not exist in the version control system or you don't have permissions`
    );
  }
};
