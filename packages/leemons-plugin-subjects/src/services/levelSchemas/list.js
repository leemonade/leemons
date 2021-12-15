const findEntity = require('./private/findEntity');

const table = leemons.query('plugins_subjects::levelSchemas');

module.exports = async function list({ userSession, locale, transacting } = {}) {
  return global.utils.withTransaction(
    async (t) => {
      const levelSchemasIds = (await findEntity({}, { transacting: t, columns: ['id'] })).map(
        ({ id }) => id
      );

      return Promise.all(
        levelSchemasIds.map((id) =>
          leemons.plugin.services.levelSchemas.get(id, { userSession, locale, transacting: t })
        )
      );
    },
    table,
    transacting
  );
};
