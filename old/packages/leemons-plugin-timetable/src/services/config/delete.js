const deleteBreaks = require('./breakes/delete');
const get = require('./get');

const configTable = leemons.query('plugins_timetable::config');

module.exports = async function deleteConfig(entitiesObj, { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      // Get the config object
      const config = await get(entitiesObj, { transacting });

      if (!config) {
        return false;
      }

      // Delete related breaks
      await deleteBreaks({ configId: config.id }, { transacting });

      // Delete config
      await configTable.delete({ id: config.id }, { transacting });
      return true;
    },
    t,
    configTable
  );
};
