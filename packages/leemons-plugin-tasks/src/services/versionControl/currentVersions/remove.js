const { currentVersions } = require('../../table');
const { removeVersion } = require('../versions');
const getVersion = require('../versions/getVersion');

module.exports = async function remove(uuid, published = 'all', { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      // EN: Remove all the published versions if needed
      // ES: Elimina todas las versiones publicadas si es necesario
      if (published === true || published === 'all') {
        await removeVersion(uuid, { published: true, version: 'all', transacting });
      }

      // EN: Remove all the draft versions if needed
      // ES: Elimina todas las versiones en borrador si es necesario
      if (published === false || published === 'all') {
        await removeVersion(uuid, { published: false, version: 'all', transacting });
      }

      // EN: Check if the version control should be removed on this entity
      // ES: Comprueba si el sistema de control de versiones debe ser eliminado en esta entidad
      if (published !== 'all') {
        try {
          console.log('Checking if', uuid, !published, 'exists');
          const exV = await getVersion(uuid, {
            published: !published,
            version: 'latest',
            transacting,
          });
          console.log('verson exists', exV);

          return {
            uuid,
            deleted: false,
            reason: `There are still ${published ? 'draft' : 'published'} versions`,
          };
        } catch (e) {
          console.log("version doesn't exist", e);
          // EN: The version control should be removed
          // ES: El sistema de control de versiones debe ser eliminado
        }
      }

      // EN: Remove the version control
      // ES: Elimina el sistema de control de versiones
      await currentVersions.deleteMany(
        {
          id: uuid,
        },
        { transacting }
      );

      return { uuid, deleted: true, reason: 'No versions left' };
    },
    currentVersions,
    t
  );
};
