async function removeAllItemsCache() {
  leemons.cache.deleteByPrefix(`users:permissions`);
}

module.exports = { removeAllItemsCache };
