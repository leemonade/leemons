const entitiesFormat = require('../../helpers/config/entitiesFormat');

const configTable = leemons.query('plugins_timetable::config');

module.exports = function has(entitiesObj, { transacting } = {}) {
  const { entities, entityTypes } = entitiesFormat(entitiesObj);

  return configTable.count({ entities, entityTypes }, { transacting }).then((count) => count > 0);
};
