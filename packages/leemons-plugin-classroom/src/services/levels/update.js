module.exports = function update(id, { names, descriptions, parent, transacting } = {}) {
  const services = leemons.plugin.services.levels;
  return global.utils.withTransaction(
    async (t) => {
      if (descriptions !== undefined) {
        await services.setDescriptions(id, descriptions, { transacting: t });
      }
      if (names !== undefined) {
        await services.setNames(id, names, { transacting: t });
      }
      if (parent !== undefined) {
        await services.setParent(id, parent, { transacting: t });
      }

      return services.get(id, { transacting: t });
    },
    leemons.query('plugins_classroom::levels'),
    transacting
  );
};
