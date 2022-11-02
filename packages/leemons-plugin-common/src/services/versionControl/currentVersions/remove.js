const {
  table: { currentVersions },
} = require('../../tables');
const removeVersion = require('../versions/removeVersion');
const getVersion = require('../versions/getVersion');
const { parseId } = require('../helpers');

module.exports = async function remove(id, published = 'all', { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const { uuid, fullId } = await parseId(id, { transacting });

      if (!['all', 'version', true, false].includes(published)) {
        throw new Error('published must be one of: all, true, false');
      }

      if (published === 'version') {
        await removeVersion.bind(this)(fullId, { transacting });
      }

      // EN: Remove all the published versions if needed
      // ES: Elimina todas las versiones publicadas si es necesario
      if (published === true || published === 'all') {
        await removeVersion.bind(this)(uuid, { published: true, version: 'all', transacting });
      }

      // EN: Remove all the draft versions if needed
      // ES: Elimina todas las versiones en borrador si es necesario
      if (published === false || published === 'all') {
        await removeVersion.bind(this)(uuid, { published: false, version: 'all', transacting });
      }

      // EN: Check if the version control should be removed on this entity
      // ES: Comprueba si el sistema de control de versiones debe ser eliminado en esta entidad
      if (published !== 'all') {
        try {
          await getVersion.bind(this)(uuid, {
            version: 'latest',
            transacting,
          });

          return {
            uuid,
            deleted: false,
            reason: `There are still ${published ? 'draft' : 'published'} versions`,
          };
        } catch (e) {
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
