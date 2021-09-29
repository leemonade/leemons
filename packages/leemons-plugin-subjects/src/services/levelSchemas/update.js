module.exports = function update(id, { isSubject, names, parent, transacting } = {}) {
  const services = leemons.plugin.services.levelSchemas;
  return global.utils.withTransaction(
    async (t) => {
      if (isSubject !== undefined) {
        await services.setisSubject(id, isSubject, { transacting: t });
      }
      if (names !== undefined) {
        await services.setNames(id, names, { transacting: t });
      }
      if (parent !== undefined) {
        await services.setParent(id, parent, { transacting: t });
      }

      return services.get(id, { transacting: t });
    },
    leemons.query('plugins_subjects::levelSchemas'),
    transacting
  );
};
