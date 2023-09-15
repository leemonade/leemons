const { LeemonsError } = require('@leemons/error');
const removeVersion = require('../versions/removeVersion');
const getVersion = require('../versions/getVersion');
const { parseId } = require('../helpers');

module.exports = async function remove({ id, published = 'all', ctx }) {
  const { uuid, fullId } = await parseId({ id, ctx });

  if (!['all', 'version', true, false].includes(published)) {
    throw new LeemonsError(ctx, { message: 'published must be one of: all, true, false' });
  }

  if (published === 'version') {
    await removeVersion({ id: fullId, ctx });
  }

  // EN: Remove all the published versions if needed
  // ES: Elimina todas las versiones publicadas si es necesario
  if (published === true || published === 'all') {
    await removeVersion({ id: uuid, published: true, version: 'all', ctx });
  }

  // EN: Remove all the draft versions if needed
  // ES: Elimina todas las versiones en borrador si es necesario
  if (published === false || published === 'all') {
    await removeVersion({ id: uuid, published: false, version: 'all', ctx });
  }

  // EN: Check if the version control should be removed on this entity
  // ES: Comprueba si el sistema de control de versiones debe ser eliminado en esta entidad
  if (published !== 'all') {
    try {
      await getVersion({ id: { id: uuid, version: 'latest' }, ctx });

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
  await ctx.tx.db.CurrentVersions.deleteMany({
    id: uuid,
  });

  return { uuid, deleted: true, reason: 'No versions left' };
};
