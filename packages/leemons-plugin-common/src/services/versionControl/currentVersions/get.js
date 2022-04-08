const { currentVersions } = require('../../tables');

module.exports = async function get(uuid, { transacting } = {}) {
  try {
    const versionedEntity = await currentVersions.findOne(
      {
        id: uuid,
      },
      { transacting }
    );

    return { uuid: versionedEntity.id, current: versionedEntity.published };
  } catch (e) {
    throw new Error(`The uuid ${uuid} does not exist in the version control system`);
  }
};
