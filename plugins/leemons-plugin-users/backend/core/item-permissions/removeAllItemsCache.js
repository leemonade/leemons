const { permissionsNamespace } = require('../../helpers/cacheKeys');

async function removeAllItemsCache({ ctx }) {
  return ctx.cache.deleteByNamespace(permissionsNamespace);
}

module.exports = { removeAllItemsCache };
