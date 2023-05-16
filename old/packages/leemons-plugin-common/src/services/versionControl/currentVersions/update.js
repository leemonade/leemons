const {
  table: { currentVersions },
} = require('../../tables');
const { stringifyVersion } = require('../helpers');
const getVersion = require('../versions/getVersion');

module.exports = async function update(uuid, version, { transacting } = {}) {
  let v = version;

  if (v !== null && typeof v !== 'string') {
    v = await stringifyVersion(version);
  }

  if (version !== null) {
    try {
      // EN: Validate if the version exists in the version control system, if not, it throws
      // ES: Valida si la versión existe en el sistema de control de versiones, si no, lanza un error
      await getVersion.bind(this)({ id: uuid, version: v }, { published: true, transacting });
    } catch (e) {
      throw new Error(
        `The uuid ${uuid} does not have a version ${v} in the version control system, or is not published yet, or you don't have permissions`
      );
    }
  }

  try {
    const versionedEntity = await currentVersions.update(
      {
        id: uuid,
      },
      {
        published: v,
      },
      { transacting }
    );

    return { uuid: versionedEntity.id, currentPublished: versionedEntity.published };
  } catch (e) {
    throw new Error(`The uuid ${uuid} does not exist in the version control system`);
  }
};
