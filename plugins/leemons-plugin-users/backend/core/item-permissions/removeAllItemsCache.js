async function removeAllItemsCache({ ctx }) {
  return ctx.cache.deleteByPrefix(`users:permissions`);
}

module.exports = { removeAllItemsCache };
