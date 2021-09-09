const table = leemons.query('plugins_classroom::levelSchemas');

module.exports = async function list({ locale, transacting } = {}) {
  return global.utils.withTransaction(
    async (t) => {
      const levelSchemasIds = (await table.find({}, { transacting: t, columns: ['id'] })).map(
        ({ id }) => id
      );

      return Promise.all(
        levelSchemasIds.map((id) =>
          leemons.plugin.services.levelSchemas.get(id, { locale, transacting: t })
        )
      );
    },
    table,
    transacting
  );
};
