async function removeAllItemsCache() {
  return leemons.cache.deleteByPrefix(`users:permissions`);
}

module.exports = { removeAllItemsCache };
