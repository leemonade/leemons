module.exports = function update(id, { isClass, names, parent, transacting } = {}) {
  const services = leemons.plugin.services.levelSchemas;
  return global.utils.withTransaction(
    async (t) => {
      if (isClass !== undefined) {
        await services.setIsClass(id, isClass, { transacting: t });
      }
      if (names !== undefined) {
        await services.setNames(id, names, { transacting: t });
      }
      if (parent !== undefined) {
        await services.setParent(id, parent, { transacting: t });
      }

      return services.get(id, { transacting: t });
    },
    leemons.query('plugins_classroom::levelSchemas'),
    transacting
  );
};
