async function removeAllItemsCache({ ctx }) {
  // TODO Añadir cache a ctx
  return leemons.cache.deleteByPrefix(`users:permissions`);
}

module.exports = { removeAllItemsCache };
