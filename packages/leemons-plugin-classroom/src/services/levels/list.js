const table = leemons.query('plugins_classroom::levels');

module.exports = async function list({ locale, transacting } = {}) {
  return global.utils.withTransaction(
    async (t) => {
      const levelsIds = (await table.find({}, { transacting: t, columns: ['id'] })).map(
        ({ id }) => id
      );

      return Promise.all(
        levelsIds.map((id) => leemons.plugin.services.levels.get(id, { locale, transacting: t }))
      );
    },
    table,
    transacting
  );
};
