const { currentVersions } = require('../../tables');
const { createVersion } = require('../versions');

module.exports = async function create({ published = false, transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const obj = {
        published: published ? '1.0.0' : null,
      };

      const versionedEntity = await currentVersions.create(obj, { transacting });

      await createVersion(versionedEntity.id, { version: '1.0.0', published, transacting });

      return { uuid: versionedEntity.id, currentPublished: versionedEntity.published };
    },
    currentVersions,
    t
  );
};
